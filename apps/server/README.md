# Sijuk Server API

Production-ready Hono + tRPC backend with Better Auth and MongoDB (Mongoose).

## Features

- Auth via Better Auth (email/password) with sessions
- Roles: SUPER_ADMIN, ADMIN, OWNER, USER
- Super/Admin: create owner accounts, manage restaurants
- Owner: manage products, stock, POS orders, view stats
- Orders lifecycle + basic notifications
- Zod validation, CORS, security headers, centralized errors

## Environment

Create `.env` based on `.env.example`:

```
DATABASE_URL=mongodb+srv://...
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

## Install & Run

Using Bun:

```
bun install
bun run --filter server dev
```

Build:

```
bun run --filter server build
bun run --filter server start
```

## Seeding Super Admin

Call tRPC mutation `seedSuperAdmin` once to create the initial SUPER_ADMIN.

Input:

```
{ name, email, password }
```

## tRPC Routers

- `admin.createOwnerAndRestaurant`
- `admin.listRestaurants`
- `admin.updateRestaurant`
- `owner.myRestaurants`
- `owner.createProduct`
- `owner.updateProduct`
- `owner.deleteProduct`
- `owner.adjustStock`
- `orders.createPOSOrder`
- `orders.updateStatus`
- `orders.myOrders`
- `stats`

Auth routes are available at `/api/auth/**` via Better Auth.

## Notes

- Future features (coupons, ratings, employees, analytics) can be added via new models/routers without breaking existing contracts.
- Ensure indexes in MongoDB for scale; add as needed per collection.

---

## How to Call the APIs

Base URL examples:

- Server local: `http://localhost:3001`
- Web app origin: set `CORS_ORIGIN` accordingly

### Auth (Better Auth)

- Register: `POST /api/auth/register` with `{ name, email, password }`
- Login: `POST /api/auth/login` with `{ email, password }`
- Get Session: `GET /api/auth/session`
- Logout: `POST /api/auth/logout`

Curl example (login):

```
curl -i -X POST "$SERVER/api/auth/login" \
	-H "Content-Type: application/json" \
	--data '{"email":"admin@example.com","password":"ChangeMe123!"}' \
	-c cookies.txt -b cookies.txt
```

Session-aware requests should pass cookies (saved in `cookies.txt` above).

### tRPC over HTTP

tRPC endpoints are called via `POST /trpc/<path>` where the request body is `{ "input": <json> }`.

Examples:

- Seed Super Admin

```
curl -X POST "$SERVER/trpc/seedSuperAdmin" \
	-H "Content-Type: application/json" \
	--data '{"input":{"name":"Root","email":"admin@example.com","password":"ChangeMe123!"}}' \
	-c cookies.txt -b cookies.txt
```

- Admin: Create Owner + Restaurant

```
curl -X POST "$SERVER/trpc/admin.createOwnerAndRestaurant" \
	-H "Content-Type: application/json" \
	--data '{"input":{"owner":{"name":"Jane Owner","email":"owner@example.com","password":"Passw0rd!"},"restaurant":{"name":"Cafe 123","description":"Nice place","image":"https://example.com/logo.png","location":{"address":"123 Main","mapUrl":"https://maps.example","coordinates":{"lat":23.78,"lng":90.41}}}}}' \
	-c cookies.txt -b cookies.txt
```

- Owner: Create Product

```
curl -X POST "$SERVER/trpc/owner.createProduct" \
	-H "Content-Type: application/json" \
	--data '{"input":{"restaurantId":"<restaurantId>","name":"Latte","type":"BEVERAGE","basePrice":3.5,"variants":[{"name":"Large","priceDelta":1}],"addons":[{"name":"Extra Shot","price":0.5}],"stock":50}}' \
	-c cookies.txt -b cookies.txt
```

- Owner: Adjust Stock

```
curl -X POST "$SERVER/trpc/owner.adjustStock" \
	-H "Content-Type: application/json" \
	--data '{"input":{"productId":"<productId>","quantity":-5,"reason":"sold"}}' \
	-c cookies.txt -b cookies.txt
```

- POS: Create Order

```
curl -X POST "$SERVER/trpc/orders.createPOSOrder" \
	-H "Content-Type: application/json" \
	--data '{"input":{"restaurantId":"<restaurantId>","items":[{"productId":"<productId>","quantity":2,"variant":{"name":"Large","priceDelta":1},"addons":[{"name":"Extra Shot","price":0.5}]}],"notes":"Takeaway"}}' \
	-c cookies.txt -b cookies.txt
```

- Orders: Update Status

```
curl -X POST "$SERVER/trpc/orders.updateStatus" \
	-H "Content-Type: application/json" \
	--data '{"input":{"orderId":"<orderId>","status":"CONFIRMED"}}' \
	-c cookies.txt -b cookies.txt
```

- Notifications: Fetch & Mark Read

```
curl -X POST "$SERVER/trpc/notifications.my" -H "Content-Type: application/json" --data '{}' -c cookies.txt -b cookies.txt
curl -X POST "$SERVER/trpc/notifications.markRead" -H "Content-Type: application/json" --data '{"input":{"id":"<notificationId>"}}' -c cookies.txt -b cookies.txt
```

### Request Limits & Headers

- Rate limits: `/api/auth/*` 60/min per IP, `/trpc/*` 120/min per IP
- Security headers set (X-Content-Type-Options, X-Frame-Options, Referrer-Policy)
- Each response includes `X-Request-Id`

### API Visualization

- tRPC Panel (dev only): after starting the server with `NODE_ENV!=production`, open:
  - `http://localhost:3001/trpc-panel`
    This provides interactive documentation and the ability to execute your tRPC procedures.

- Swagger/OpenAPI (alternative): since this backend uses tRPC, there is no REST controller layer to auto-scan. If you need Swagger docs, consider adding a small OpenAPI surface for selected endpoints or adopting a generator that maps tRPC routers to OpenAPI. Two options:
  - Use `trpc-openapi` to expose a REST subset and generate an OpenAPI spec.
  - Maintain a separate `openapi.yaml` for public REST endpoints while keeping internal dashboards on tRPC.
