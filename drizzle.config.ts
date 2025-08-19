import { defineConfig } from "drizzle-kit";

//! Do not use any imports here
const IS_TESTING = process.env.NODE_ENV === "test";

const DB_AUTH_TOKEN = process.env.DB_AUTH_TOKEN || "default";
const DB_REMOTE = process.env.DB_REMOTE || "file:local.db";
const DB_URL = IS_TESTING ? "file:test.db" : DB_REMOTE;

console.debug("Connecting to DB -", DB_URL);

export default defineConfig({
  breakpoints: true,
  casing: "camelCase",
  dbCredentials: {
    authToken: DB_AUTH_TOKEN,
    url: DB_URL,
  },
  dialect: "turso",
  introspect: {
    casing: "camel",
  },
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  strict: true,
  verbose: true,
});
