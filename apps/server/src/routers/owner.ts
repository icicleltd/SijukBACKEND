import { z } from "zod";
import { Product, StockMovement } from "../domain/models/product.model";
import { Restaurant } from "../domain/models/restaurant.model";
import { roleProtected, router } from "../lib/trpc";
import { newId } from "../utils/id";

const productInput = z.object({
    restaurantId: z.string(),
    name: z.string().min(1),
    description: z.string().optional(),
    image: z.string().url().optional(),
    type: z.enum(["FOOD", "BEVERAGE"]),
    category: z.string().optional(),
    basePrice: z.number().nonnegative(),
    variants: z.array(z.object({ name: z.string(), priceDelta: z.number() })).optional(),
    addons: z.array(z.object({ name: z.string(), price: z.number() })).optional(),
    stock: z.number().int().nonnegative().default(0),
    isActive: z.boolean().optional(),
});

export const ownerRouter = router({
    myRestaurants: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).query(async ({ ctx }) =>
    {
        const userId = ctx.userId!;
        return Restaurant.find({ "owner.ownerUserId": userId }).lean();
    }),

    createProduct: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(productInput).mutation(async ({ input, ctx }) =>
    {
        // ensure ownership
        const r = await Restaurant.findOne({ _id: input.restaurantId, "owner.ownerUserId": ctx.userId });
        if (!r && ctx.userRole === "OWNER") throw new Error("Not allowed to add product to this restaurant");
        const doc = await Product.create({ _id: newId(), ...input, createdAt: new Date(), updatedAt: new Date() });
        return doc;
    }),

    updateProduct: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(
        productInput.partial().extend({ id: z.string() })
    ).mutation(async ({ input, ctx }) =>
    {
        const existing = await Product.findById(input.id);
        if (!existing) throw new Error("Product not found");
        if (ctx.userRole === "OWNER") {
            const can = await Restaurant.exists({ _id: existing.restaurantId, "owner.ownerUserId": ctx.userId });
            if (!can) throw new Error("Not allowed");
        }
        await Product.updateOne({ _id: input.id }, { $set: { ...input, id: undefined, updatedAt: new Date() } });
        return Product.findById(input.id).lean();
    }),

    deleteProduct: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) =>
    {
        const existing = await Product.findById(input.id);
        if (!existing) return { ok: true };
        if (ctx.userRole === "OWNER") {
            const can = await Restaurant.exists({ _id: existing.restaurantId, "owner.ownerUserId": ctx.userId });
            if (!can) throw new Error("Not allowed");
        }
        await Product.deleteOne({ _id: input.id });
        return { ok: true };
    }),

    adjustStock: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(
        z.object({ productId: z.string(), quantity: z.number().int(), reason: z.string().optional() })
    ).mutation(async ({ input, ctx }) =>
    {
        const prod = await Product.findById(input.productId);
        if (!prod) throw new Error("Product not found");
        if (ctx.userRole === "OWNER") {
            const can = await Restaurant.exists({ _id: prod.restaurantId, "owner.ownerUserId": ctx.userId });
            if (!can) throw new Error("Not allowed");
        }
        const newStock = Math.max(0, (prod.stock ?? 0) + input.quantity);
        await Product.updateOne({ _id: prod._id }, { $set: { stock: newStock, updatedAt: new Date() } });
        await StockMovement.create({ _id: newId(), restaurantId: prod.restaurantId, productId: prod._id, quantity: input.quantity, reason: input.reason, createdBy: ctx.userId!, createdAt: new Date() });
        return { productId: prod._id, stock: newStock };
    }),
});
