import { defineConfig } from "drizzle-kit";

import env from "@/types";

console.debug("Initializing -", env._databaseUrl);

export default defineConfig({
  dbCredentials: { url: env._databaseUrl },
  dialect: "turso",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  strict: true,
  verbose: true,
});
