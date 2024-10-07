/* eslint-disable node/prefer-global/process */
import type { PinoLogger } from "hono-pino";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, type ZodError } from "zod";

expand(config());

export interface Bindings {
  Variables: {
    logger: PinoLogger;
  };
}

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  SECRET_CONFIG: z.string(),
  PUBLIC_CONFIG: z.string(),
  LOG_LEVEL: z.enum(["debug", "info", "warn"]),
  HOST_PORT: z.coerce.number(),
  HOST_DOMAIN: z.string(),
  DB_FILENAME: z.string(),

  // Computed
  isProduction: z.optional(z.boolean()),
});

// eslint-disable-next-line import/no-mutable-exports
let env: z.infer<typeof EnvSchema>;
try {
  env = EnvSchema.parse(import.meta.env || process.env);

  env.isProduction = import.meta.env.PROD || env.NODE_ENV === "production";
}
catch (error) {
  const e = error as ZodError;
  console.error("❌ Invalid env:", e.flatten());
  process.exit(1);
}

export default env;
