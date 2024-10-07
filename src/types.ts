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
  _isProduction: z.optional(z.boolean()),
  DB_FILENAME: z.string(),
  DB_MODE: z.enum(["development", "production"]),
  HOST_DOMAIN: z.string(),
  HOST_PORT: z.coerce.number(),
  LOG_LEVEL: z.enum(["debug", "info", "warn"]),
  NODE_ENV: z.string(),
});

// eslint-disable-next-line import/no-mutable-exports
let env: z.infer<typeof EnvSchema>;
try {
  env = EnvSchema.parse(import.meta.env || process.env);

  //*  Make sure to generate all computed variables!!
  env._isProduction = import.meta.env.PROD || env.NODE_ENV === "production";
}
catch (error) {
  const e = error as ZodError;
  console.error("❌ Invalid env:", e.flatten());
  process.exit(1);
}

export default env;
