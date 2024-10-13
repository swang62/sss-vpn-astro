import { z } from "zod";

// Must be
// DB_REMOTE
// DB_AUTH_TOKEN

// Server-side variables, avoid using this in SSG
const EnvSchema = z.object({
  _isProduction: z.boolean().default(false),
  API_TOKEN: z.string(),
  LOG_LEVEL: z
    .enum(["silent", "debug", "info", "warn", "error"])
    .default("debug"),
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

//* Computed *//
env._isProduction = env.NODE_ENV === "production";

export default env!;
