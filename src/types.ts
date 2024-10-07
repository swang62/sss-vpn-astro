import type { PinoLogger } from "hono-pino";

import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z } from "zod";

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

const env = EnvSchema.parse(import.meta.env || process.env);
env.isProduction = import.meta.env.PROD || env.NODE_ENV === "production";

export default env;
