import type { Context as HonoContext } from "hono";
import { UserProfile } from "../domain/models/user-profile.model";
import { auth } from "./auth";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions)
{
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});
	let profile: Awaited<ReturnType<typeof UserProfile.findById>> | null = null;
	if (session?.user?.id) {
		profile = await UserProfile.findById(session.user.id);
	}
	const userRole = (profile as any)?.role ?? null;
	return {
		session,
		profile,
		userId: session?.user?.id ?? null,
		userRole,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
