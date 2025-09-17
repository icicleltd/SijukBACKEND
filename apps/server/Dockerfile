# Bun + Hono server
FROM oven/bun:1.2 as base
WORKDIR /app

# install deps at repo root to leverage workspace
COPY ../../package.json ../../bun.lock ../../turbo.json ./
COPY ../../apps/server/package.json ./apps/server/
RUN bun install --frozen-lockfile

# copy server sources
COPY ../../apps/server ./apps/server
WORKDIR /app/apps/server
RUN bun run build

FROM oven/bun:1.2 as runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/apps/server/dist ./dist
COPY --from=base /app/apps/server/package.json ./package.json

EXPOSE 3001
CMD ["bun","run","start"]
