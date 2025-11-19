import { z } from "zod";

const EnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().default("default"),
  DB_AUTH_TOKEN: z.string().default("default"),
  DB_REMOTE: z.string().optional(),
  HIDDIFY_API_KEY: z.string().optional(),
  LOG_LEVEL: z
    .enum(["silent", "debug", "info", "warn", "error"])
    .default("debug"),
  NODE_ENV: z.string().default("development"),
  POSTMARK_TOKEN: z.string().optional(),
  REDIS_PASS: z.string().optional(),
  REDIS_URL: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

const { data, error } = EnvSchema.safeParse({
  ...(import.meta.env ?? {}),
  ...(process.env ?? {}),
});

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(z.treeifyError(error), null, 2));
  process?.exit(1);
}

if (data.LOG_LEVEL !== "silent") {
  console.debug("SERVER_ENV", data);
}

//* Constants *//
export const DB_AUTH_TOKEN = data.DB_AUTH_TOKEN;
export const DB_REMOTE = data.DB_REMOTE;
export const HIDDIFY_API_KEY = data.HIDDIFY_API_KEY;
export const LOG_LEVEL = data.LOG_LEVEL;
export const NODE_ENV = data.NODE_ENV;
export const POSTMARK_TOKEN = data.POSTMARK_TOKEN;
export const REDIS_PASS = data.REDIS_PASS;
export const REDIS_URL = data.REDIS_URL;
export const STRIPE_SECRET_KEY = data.STRIPE_SECRET_KEY;
export const STRIPE_WEBHOOK_SECRET = data.STRIPE_WEBHOOK_SECRET;

//* Computed *//
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_TESTING = NODE_ENV === "test";

//* DB access and seeding *//
export const DB_LOCAL_URL = IS_TESTING ? "file:test.db" : "file:local.db";
export const DB_SYNC_URL = IS_TESTING ? undefined : DB_REMOTE;
