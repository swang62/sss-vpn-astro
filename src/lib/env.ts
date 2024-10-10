/* eslint-disable import/no-mutable-exports */
/* eslint-disable node/prefer-global/process */

import { z, type ZodError } from "zod";

const EnvSchema = z.object({
  _isProduction: z.boolean().default(false),
  DB_PATH: z.string().url(),
  HOST_DOMAIN: z.string().url(),
  HOST_PORT: z.coerce.number(),
  LOG_LEVEL: z.enum(["silent", "debug", "info", "warn", "error"]),
  NODE_ENV: z.string().default("development"),
});

let env: z.infer<typeof EnvSchema>;
try {
  env = EnvSchema.parse(import.meta.env);

  //* COMPUTED *//
  env._isProduction = env.NODE_ENV === "production";
}
catch (error) {
  const e = error as ZodError;
  console.error("❌ Invalid env:", e.flatten());
  process.exit(1);
}

export default env;
