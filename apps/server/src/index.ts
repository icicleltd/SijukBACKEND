import { trpcServer } from "@hono/trpc-server";
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { timing } from "hono/timing";
import { randomUUID } from "node:crypto";
import { generateOpenApiDocument } from "trpc-to-openapi";
import { Order } from "./domain/models/order.model";
import { Product } from "./domain/models/product.model";
import { Restaurant } from "./domain/models/restaurant.model";
import { auth } from "./lib/auth";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { env } from "./utils/env";
import { createRateLimiter } from "./utils/rate-limit";

const app = new Hono();

app.use(logger());
app.use(timing());
// attach request id
app.use("/*", async (c, next) =>
{
	const id = randomUUID();
	c.header("X-Request-Id", id);
	await next();
});
app.use(
	"/*",
	cors({
		origin: env.CORS_ORIGIN,
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

// Security headers
app.use("/*", async (c, next) =>
{
	await next();
	c.header("X-Content-Type-Options", "nosniff");
	c.header("X-Frame-Options", "DENY");
	c.header("Referrer-Policy", "no-referrer");
});

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));
// Rate limits
app.use("/api/auth/*", createRateLimiter({ windowMs: 60_000, max: 60 }));

// Aliases for common auth paths
app.post("/api/auth/login", (c) =>
{
	const req = new Request(new URL("/api/auth/sign-in/email", c.req.url), {
		method: "POST",
		headers: c.req.raw.headers,
		body: c.req.raw.body,
	});
	return auth.handler(req);
});

app.post("/api/auth/register", (c) =>
{
	const req = new Request(new URL("/api/auth/sign-up/email", c.req.url), {
		method: "POST",
		headers: c.req.raw.headers,
		body: c.req.raw.body,
	});
	return auth.handler(req);
});

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) =>
		{
			return createContext({ context });
		},
	}),
);
app.use("/trpc/*", createRateLimiter({ windowMs: 60_000, max: 120 }));

// Simple session check alias to avoid 404s
app.get("/api/auth/get-session", async (c) =>
{
	const ctx = await createContext({ context: c });
	if (!ctx.session) return c.json({ authenticated: false }, 200);
	return c.json({ authenticated: true, user: ctx.session.user, role: ctx.userRole }, 200);
});

app.get("/", (c) =>
{
	return c.text("OK");
});

// Minimal REST endpoints to match OpenAPI docs
app.get("/health", (c) =>
{
	return c.json("OK");
});

app.get("/stats", async (c) =>
{
	const ctx = await createContext({ context: c });
	if (!ctx.session) {
		return c.json({ message: "Authentication required" }, 401);
	}
	if (ctx.userRole === "OWNER") {
		const restaurants = await Restaurant.find({ "owner.ownerUserId": ctx.userId }).lean();
		const ids = restaurants.map((r) => r._id);
		const [orders, products] = await Promise.all([
			Order.countDocuments({ restaurantId: { $in: ids } }),
			Product.countDocuments({ restaurantId: { $in: ids } }),
		]);
		return c.json({ restaurants: ids.length, orders, products });
	}
	const [restaurants, orders, products] = await Promise.all([
		Restaurant.countDocuments({}),
		Order.countDocuments({}),
		Product.countDocuments({}),
	]);
	return c.json({ restaurants, orders, products });
});

// tRPC Panel (dev only)
if (env.NODE_ENV !== "production") {
	const ENABLE_TRPC_PANEL = process.env.ENABLE_TRPC_PANEL === "true";
	if (ENABLE_TRPC_PANEL) {
		const setupPanel = async () =>
		{
			try {
				const { renderTrpcPanel } = await import("trpc-panel");
				// Warning: trpc-panel officially supports tRPC v10 only; v11 may show parse errors.
				const panelHtml = renderTrpcPanel(appRouter as any, { url: "/trpc", transformer: undefined });
				app.get("/trpc-panel", (c) => c.html(panelHtml));
			} catch (err) {
				console.warn("tRPC Panel unavailable:", err);
				app.get("/trpc-panel", (c) => c.text("tRPC Panel unavailable. See /docs for OpenAPI."));
			}
		};
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		setupPanel();
	} else {
		app.get("/trpc-panel", (c) =>
		{
			const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>tRPC Panel Disabled</title>
	<style>body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto;max-width:720px;margin:40px auto;padding:0 16px;color:#222} code{background:#f5f5f5;padding:2px 6px;border-radius:4px}</style>
	</head>
	<body>
		<h1>tRPC Panel Disabled</h1>
		<p>tRPC Panel is disabled by default to avoid noisy parse logs with tRPC v11.</p>
		<p>Use the OpenAPI docs instead:</p>
		<ul>
			<li><a href="/docs">/docs</a></li>
			<li><a href="/openapi.json">/openapi.json</a></li>
		</ul>
		<p>To enable the experimental panel, set <code>ENABLE_TRPC_PANEL=true</code> and reload.</p>
	</body>
</html>`;
			return c.html(html);
		});
	}
}

// OpenAPI JSON
app.get("/openapi.json", (c) =>
{
	const url = new URL(c.req.url);
	const openApiDoc = generateOpenApiDocument(appRouter, {
		title: "Sijuk API",
		version: "1.0.0",
		baseUrl: url.origin,
		// Optionally define security schemes if you want to document auth
		// securitySchemes: {
		//     sessionCookie: {
		//         type: "apiKey",
		//         in: "cookie",
		//         name: "auth_session",
		//     },
		// },
	});
	return c.json(openApiDoc);
});

// Swagger UI at /docs (CDN-based to avoid bundling assets)
app.get("/docs", (c) =>
{
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Sijuk API Docs</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  <style>html,body,#swagger-ui{height:100%} body{margin:0}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
	window.ui = SwaggerUIBundle({
	  url: '/openapi.json',
	  dom_id: '#swagger-ui',
	  presets: [SwaggerUIBundle.presets.apis],
	  layout: 'BaseLayout'
	});
  </script>
  </body>
  </html>`;
	return c.html(html);
});

// Global error handler
app.onError((err, c) =>
{
	console.error(err);
	const id = c.res.headers.get("X-Request-Id") || undefined;
	return c.json({ message: err.message ?? "Internal Server Error", requestId: id }, 500);
});

export default app;
