import type { Context, Next } from "hono";

type KeyFn = (c: Context) => string;

export function createRateLimiter(options: { windowMs: number; max: number; keyGenerator?: KeyFn })
{
    const store = new Map<string, { count: number; resetAt: number }>();
    const keyGen: KeyFn = options.keyGenerator ?? ((c) => c.req.header("x-forwarded-for")?.split(",")[0].trim() || c.req.header("cf-connecting-ip") || c.req.header("x-real-ip") || (c.req.raw as any).ip || "unknown");

    return async (c: Context, next: Next) =>
    {
        const key = keyGen(c);
        const now = Date.now();
        const entry = store.get(key);
        if (!entry || entry.resetAt <= now) {
            store.set(key, { count: 1, resetAt: now + options.windowMs });
            c.header("X-RateLimit-Limit", String(options.max));
            c.header("X-RateLimit-Remaining", String(options.max - 1));
            c.header("X-RateLimit-Reset", String(Math.ceil((now + options.windowMs) / 1000)));
            await next();
            return;
        }
        if (entry.count >= options.max) {
            const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
            c.header("Retry-After", String(retryAfter));
            c.header("X-RateLimit-Limit", String(options.max));
            c.header("X-RateLimit-Remaining", "0");
            c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));
            return c.json({ message: "Too Many Requests" }, 429);
        }
        entry.count += 1;
        c.header("X-RateLimit-Limit", String(options.max));
        c.header("X-RateLimit-Remaining", String(options.max - entry.count));
        c.header("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));
        await next();
    };
}
