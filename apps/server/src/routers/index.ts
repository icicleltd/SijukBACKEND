import { z } from "zod";
import { Order } from "../domain/models/order.model";
import { Product } from "../domain/models/product.model";
import { Restaurant } from "../domain/models/restaurant.model";
import { UserProfile } from "../domain/models/user-profile.model";
import { auth } from "../lib/auth";
import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { adminRouter } from "./admin";
import { notificationsRouter } from "./notifications";
import { ordersRouter } from "./orders";
import { ownerRouter } from "./owner";

export const appRouter = router({
	healthCheck: publicProcedure
		.meta({ openapi: { method: "GET", path: "/health", summary: "Health Check" } })
		.input(z.void())
		.output(z.string())
		.query(() =>
		{
			return "OK";
		}),
	privateData: protectedProcedure.query(({ ctx }) =>
	{
		return { message: "This is private", user: ctx.session.user };
	}),
	admin: adminRouter,
	owner: ownerRouter,
	orders: ordersRouter,
	notifications: notificationsRouter,
	stats: protectedProcedure
		.meta({ openapi: { method: "GET", path: "/stats", summary: "Basic Stats", protect: true } })
		.input(z.void())
		.output(z.object({ restaurants: z.number(), orders: z.number(), products: z.number() }))
		.query(async ({ ctx }) =>
		{
			// basic stats, scoped: super/admin -> all, owner -> own restaurants
			if (ctx.userRole === "OWNER") {
				const restaurants = await Restaurant.find({ "owner.ownerUserId": ctx.userId }).lean();
				const ids = restaurants.map((r) => r._id);
				const [orders, products] = await Promise.all([
					Order.countDocuments({ restaurantId: { $in: ids } }),
					Product.countDocuments({ restaurantId: { $in: ids } }),
				]);
				return { restaurants: ids.length, orders, products };
			}
			const [restaurants, orders, products] = await Promise.all([
				Restaurant.countDocuments({}),
				Order.countDocuments({}),
				Product.countDocuments({}),
			]);
			return { restaurants, orders, products };
		}),
	seedSuperAdmin: publicProcedure.input(
		// allow only in development or when no super admin exists
		z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) })
	).mutation(async ({ input }) =>
	{
		const existing = await UserProfile.findOne({ role: "SUPER_ADMIN" }).lean();
		if (existing) return { ok: true, message: "Super admin already exists" };
		const res = await auth.api.signUpEmail({ body: input });
		const user = (res as any).user;
		if (!user?.id) throw new Error("Failed to create super admin user");
		await UserProfile.create({ _id: user.id, role: "SUPER_ADMIN", managedRestaurantIds: [], createdAt: new Date(), updatedAt: new Date() });
		return { ok: true };
	}),
});
export type AppRouter = typeof appRouter;
