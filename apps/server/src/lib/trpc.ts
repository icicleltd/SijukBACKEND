import { initTRPC, TRPCError } from "@trpc/server";
import type { OpenApiMeta } from "trpc-to-openapi";
import type { Context } from "./context";

export const t = initTRPC.meta<OpenApiMeta>().context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) =>
{
	if (!ctx.session) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "Authentication required",
			cause: "No session",
		});
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	});
});

export const roleProtected = (roles: string[]) =>
	t.procedure.use(({ ctx, next }) =>
	{
		if (!ctx.session) {
			throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
		}
		const role = (ctx as any).userRole as string | null;
		if (!role || !roles.includes(role)) {
			throw new TRPCError({ code: "FORBIDDEN", message: "Insufficient permissions" });
		}
		return next();
	});
