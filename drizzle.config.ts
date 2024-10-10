/* eslint-disable node/prefer-global/process */
import { defineConfig } from "drizzle-kit";

const url = process.env.DB_PATH || "";
console.debug("Connecting to DB -", url);

export default defineConfig({
  dbCredentials: { url },
  dialect: "turso",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  strict: true,
  verbose: true,
});
