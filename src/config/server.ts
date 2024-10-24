import { z } from "zod";

import { DB_LOCAL, DB_TEST } from "./constants";

// Server-side variables
const EnvSchema = z.object({
  API_TOKEN: z.string(),
  DB_AUTH_TOKEN: z.string().default("default"),
  DB_REMOTE: z.string().optional(),
  LOG_LEVEL: z.enum([
    "silent",
    "debug",
    "info",
    "warn",
    "error",
    "placeholder",
  ]),
  NODE_ENV: z.string().default("development"),
  POSTMARK_TOKEN: z.string().default(""),
  REDIS_PASS: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

// @ts-ignore
const { data, error } = EnvSchema.safeParse({
  ...(import.meta.env ?? {}),
  ...(process.env ?? {}),
});

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process?.exit(1);
}

if (import.meta.env?.DEV && data.LOG_LEVEL !== "silent")
  console.debug("SERVER_ENV", data);

//* Constants *//
const DEFAULT = "placeholder"; // Catch build errors

export const API_TOKEN = data.API_TOKEN;
export const DB_AUTH_TOKEN = data.DB_AUTH_TOKEN;
export const DB_REMOTE = data.DB_REMOTE === DEFAULT ? "" : data.DB_REMOTE;
export const LOG_LEVEL = data.LOG_LEVEL === DEFAULT ? "debug" : data.LOG_LEVEL;
export const NODE_ENV = data.NODE_ENV;
export const POSTMARK_TOKEN =
  data.POSTMARK_TOKEN === DEFAULT ? "" : data.POSTMARK_TOKEN;
export const REDIS_URL = data.REDIS_URL === DEFAULT ? "" : data.REDIS_URL;
export const REDIS_PASS = data.REDIS_PASS === DEFAULT ? "" : data.REDIS_PASS;

//* Computed *//
export const IS_PRODUCTION = NODE_ENV === "production";
export const IS_TESTING = NODE_ENV === "test";

export const DB_LOCAL_URL = IS_TESTING ? DB_TEST : DB_LOCAL;
export const DB_SYNC_URL = IS_TESTING ? undefined : DB_REMOTE;

//* Hard-coded *//
export const API_SERVER_URL = "http://localhost:4321";
