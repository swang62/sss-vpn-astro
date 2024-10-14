import { defineConfig } from "drizzle-kit";

// This file should only be triggered from CLI/node
// !!! Must use relative imports !!!
import { DB_LOCAL, DB_TEST } from "./src/env/constants";

const IS_TESTING = process.env.NODE_ENV === "test";

const DB_AUTH_TOKEN = process.env.DB_AUTH_TOKEN || "default";
const DB_REMOTE = process.env.DB_REMOTE || DB_LOCAL;
const DB_URL = IS_TESTING ? DB_TEST : DB_REMOTE;

console.debug("Connecting to DB -", DB_URL);

export default defineConfig({
  dbCredentials: { authToken: DB_AUTH_TOKEN, url: DB_URL },
  dialect: "turso",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  strict: true,
  verbose: true,
});
