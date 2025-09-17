import { z } from "zod";
import { Notification } from "../domain/models/notification.model";
import { Order } from "../domain/models/order.model";
import { Product } from "../domain/models/product.model";
import { Restaurant } from "../domain/models/restaurant.model";
import { roleProtected, router } from "../lib/trpc";
import { newId } from "../utils/id";

const orderItemInput = z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    variant: z.object({ name: z.string(), priceDelta: z.number() }).optional(),
    addons: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
});

export const ordersRouter = router({
    createPOSOrder: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(
        z.object({ restaurantId: z.string(), items: z.array(orderItemInput), notes: z.string().optional() })
    ).mutation(async ({ input, ctx }) =>
    {
        // ownership check for owners
        if (ctx.userRole === "OWNER") {
            const can = await Restaurant.exists({ _id: input.restaurantId, "owner.ownerUserId": ctx.userId });
            if (!can) throw new Error("Not allowed");
        }
        const products = await Product.find({ _id: { $in: input.items.map((i) => i.productId) }, restaurantId: input.restaurantId });
        const byId = new Map(products.map((p) => [p._id, p]));
        let subtotal = 0;
        const items = input.items.map((i) =>
        {
            const p = byId.get(i.productId);
            if (!p) throw new Error("Product not found");
            const addonsTotal = (i.addons ?? []).reduce((s, a) => s + a.price, 0);
            const variantDelta = i.variant?.priceDelta ?? 0;
            const unit = p.basePrice + variantDelta + addonsTotal;
            const total = unit * i.quantity;
            subtotal += total;
            return {
                productId: p._id,
                name: p.name,
                basePrice: p.basePrice,
                quantity: i.quantity,
                variant: i.variant,
                addons: i.addons ?? [],
                total,
            };
        });
        const total = subtotal; // taxes/discounts can be added later
        const orderId = newId();
        const order = await Order.create({ _id: orderId, restaurantId: input.restaurantId, createdBy: ctx.userId!, items, subtotal, total, status: "PENDING", notes: input.notes, createdAt: new Date(), updatedAt: new Date() });
        // decrement stock
        await Promise.all(
            items.map(async (it) =>
            {
                const p = byId.get(it.productId)!;
                const newStock = Math.max(0, (p.stock ?? 0) - it.quantity);
                await Product.updateOne({ _id: it.productId }, { $set: { stock: newStock, updatedAt: new Date() } });
            })
        );
        // notify owner
        const rest = await Restaurant.findById(input.restaurantId);
        if (rest) {
            await Notification.create({ _id: newId(), userId: rest.owner.ownerUserId, restaurantId: rest._id, type: "NEW_ORDER", title: `New order #${orderId}`, message: `${items.length} items`, data: { orderId }, read: false, createdAt: new Date() });
        }
        return order;
    }),

    updateStatus: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(
        z.object({ orderId: z.string(), status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"]) })
    ).mutation(async ({ input, ctx }) =>
    {
        const o = await Order.findById(input.orderId);
        if (!o) throw new Error("Order not found");
        if (ctx.userRole === "OWNER") {
            const can = await Restaurant.exists({ _id: o.restaurantId, "owner.ownerUserId": ctx.userId });
            if (!can) throw new Error("Not allowed");
        }
        await Order.updateOne({ _id: input.orderId }, { $set: { status: input.status, updatedAt: new Date() } });
        return Order.findById(input.orderId).lean();
    }),

    myOrders: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(z.object({ restaurantId: z.string(), limit: z.number().int().min(1).max(100).default(20) })).query(async ({ input, ctx }) =>
    {
        if (ctx.userRole === "OWNER") {
            const can = await Restaurant.exists({ _id: input.restaurantId, "owner.ownerUserId": ctx.userId });
            if (!can) throw new Error("Not allowed");
        }
        return Order.find({ restaurantId: input.restaurantId }).sort({ createdAt: -1 }).limit(input.limit).lean();
    }),
});
