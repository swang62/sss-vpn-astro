import { z } from "zod";

// Server-side variables, avoid using this in SSG
const EnvSchema = z.object({
  API_TOKEN: z.string(),
  DB_AUTH_TOKEN: z.string().optional(),
  DB_REMOTE: z.string().url().optional(),
  LOG_LEVEL: z
    .enum(["silent", "debug", "info", "warn", "error"])
    .default("debug"),
  NODE_ENV: z.string().default("development"),
});

const {
  data: env,
  error,
  success,
} = EnvSchema.safeParse(import.meta.env || process.env);

if (!success || error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

//* Constants *//
export const API_TOKEN = env.API_TOKEN;
export const DB_AUTH_TOKEN = env.DB_AUTH_TOKEN;
export const DB_REMOTE = env.DB_REMOTE;
export const LOG_LEVEL = env.LOG_LEVEL;
export const NODE_ENV = env.NODE_ENV;

//* Computed *//
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_TESTING =
  NODE_ENV === "test" || process.env.NODE_ENV === "test";
