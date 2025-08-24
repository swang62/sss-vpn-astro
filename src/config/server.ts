import { z } from "zod";

//! Make sure all placeholders exist in .env.build
const EnvSchema = z.object({
  BETTER_AUTH_SECRET: z.string().default("default"),
  DB_AUTH_TOKEN: z.string().default("default"),
  DB_REMOTE: z.string().optional(),
  HIDDIFY_API_KEY: z.string().optional(),
  LOG_LEVEL: z
    .enum(["silent", "debug", "info", "warn", "error", "placeholder"])
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
const _ = "placeholder"; // Catch build errors

export const DB_AUTH_TOKEN = data.DB_AUTH_TOKEN;
export const DB_REMOTE = data.DB_REMOTE === _ ? "" : data.DB_REMOTE;
export const HIDDIFY_API_KEY = data.HIDDIFY_API_KEY;

export const LOG_LEVEL = data.LOG_LEVEL === _ ? "debug" : data.LOG_LEVEL; // prettier-ignore
export const NODE_ENV = data.NODE_ENV;
export const POSTMARK_TOKEN = data.POSTMARK_TOKEN === _ ? "" : data.POSTMARK_TOKEN; // prettier-ignore
export const REDIS_URL = data.REDIS_URL === _ ? "" : data.REDIS_URL; // prettier-ignore
export const REDIS_PASS = data.REDIS_PASS === _ ? "" : data.REDIS_PASS; // prettier-ignore
export const STRIPE_SECRET_KEY = data.STRIPE_SECRET_KEY === _ ? "" : data.STRIPE_SECRET_KEY; // prettier-ignore
export const STRIPE_WEBHOOK_SECRET = data.STRIPE_WEBHOOK_SECRET === _ ? "" : data.STRIPE_WEBHOOK_SECRET; // prettier-ignore

//* Computed *//
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_TESTING = NODE_ENV === "test";

//* DB access and seeding *//
export const DB_LOCAL_URL = IS_TESTING ? "file:test.db" : "file:local.db";
export const DB_SYNC_URL = IS_TESTING ? undefined : DB_REMOTE;
