/* eslint-disable import/no-mutable-exports */
/* eslint-disable node/prefer-global/process */

import { config } from "dotenv";
import path from "node:path";
import { z, type ZodError } from "zod";

config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  )
});

const EnvSchema = z.object({
  _isProduction: z.boolean().default(false),
  API_TOKEN: z.string(),
  DB_PATH: z.string().url(),
  GTM_ID: z.string(),
  LOG_LEVEL: z.enum(["silent", "debug", "info", "warn", "error"]),
  NODE_ENV: z.string(),
});

let env: z.infer<typeof EnvSchema>;
try {
  env = EnvSchema.parse(import.meta.env || process.env);

  //* COMPUTED *//
  env._isProduction = import.meta.env?.PROD || env.NODE_ENV === "production";
}
catch (error) {
  const e = error as ZodError;
  console.error("❌ Invalid env:", e.flatten());
  process.exit(1);
}

export default env;
