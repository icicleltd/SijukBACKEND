import { z } from "zod";

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    CORS_ORIGIN: z.string().min(1, "CORS_ORIGIN is required"),
    SERVER_INTERNAL_URL: z.string().url().optional(),
});

export const env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    SERVER_INTERNAL_URL: process.env.SERVER_INTERNAL_URL,
});
