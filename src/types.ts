/* eslint-disable node/prefer-global/process */
import type { PinoLogger } from "hono-pino";

import { config } from "dotenv";
import { z, type ZodError } from "zod";

config();

export interface Bindings {
  Variables: {
    logger: PinoLogger;
  };
}

const EnvSchema = z.object({
  _databaseUrl: z.string().default("file:local.db"),
  _isProduction: z.boolean().default(false),
  DB_PATH: z.string().url(),
  HOST_DOMAIN: z.string().url(),
  HOST_PORT: z.coerce.number(),
  LOG_LEVEL: z.enum(["debug", "info", "warn"]),
  NODE_ENV: z.string(),
});

// eslint-disable-next-line import/no-mutable-exports
let env: z.infer<typeof EnvSchema>;
try {
  env = EnvSchema.parse(import.meta.env || process.env);
  env._isProduction = import.meta.env?.PROD || env.NODE_ENV === "production";
  if (env._isProduction) {
    env._databaseUrl = env.DB_PATH;
  }
}
catch (error) {
  const e = error as ZodError;
  console.error("❌ Invalid env:", e.flatten());
  process.exit(1);
}

export default env;
