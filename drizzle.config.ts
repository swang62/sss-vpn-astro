import { defineConfig } from "drizzle-kit";

import env from "@/lib/env";

console.debug("Connecting to DB -", env.DB_PATH);

export default defineConfig({
  dbCredentials: { url: env.DB_PATH },
  dialect: "turso",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  strict: true,
  verbose: true,
});
