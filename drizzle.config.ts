/* eslint-disable node/prefer-global/process */
import { defineConfig } from "drizzle-kit";

import { DB_LOCAL, DB_TEST } from "./src/db/constants";

const syncUrl = process.env.DB_SYNC_URL || DB_LOCAL;
const url = process.env.NODE_ENV === "test" ? DB_TEST : syncUrl;

console.debug("Connecting to DB -", url);

export default defineConfig({
  dbCredentials: { url },
  dialect: "turso",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  strict: true,
  verbose: true,
});
