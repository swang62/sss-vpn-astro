/* eslint-disable node/prefer-global/process */

import { z } from "zod";

const EnvSchema = z.object({
  _isProduction: z.boolean().default(false),
  API_TOKEN: z.string(),
  DB_SYNC_URL: z.string().optional(),
  GTM_ID: z.string().optional(),
  LOG_LEVEL: z.enum(["silent", "debug", "info", "warn", "error"]),
  NODE_ENV: z.string().default("development"),
});

const { data: env, error } = EnvSchema.safeParse(
  import.meta.env || process.env,
);
if (!env || error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

//* COMPUTED *//
env._isProduction = env.NODE_ENV === "production";

export default env!;
