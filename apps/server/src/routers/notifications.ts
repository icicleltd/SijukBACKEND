import { z } from "zod";
import { Notification } from "../domain/models/notification.model";
import { roleProtected, router } from "../lib/trpc";

export const notificationsRouter = router({
    my: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(
        z.object({ limit: z.number().int().min(1).max(100).default(20) }).optional()
    ).query(async ({ ctx, input }) =>
    {
        const limit = input?.limit ?? 20;
        return Notification.find({ userId: ctx.userId }).sort({ createdAt: -1 }).limit(limit).lean();
    }),
    markRead: roleProtected(["OWNER", "ADMIN", "SUPER_ADMIN"]).input(
        z.object({ id: z.string() })
    ).mutation(async ({ input, ctx }) =>
    {
        await Notification.updateOne({ _id: input.id, userId: ctx.userId }, { $set: { read: true } });
        return { ok: true };
    }),
});
