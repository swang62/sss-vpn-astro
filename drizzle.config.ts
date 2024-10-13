import { defineConfig } from "drizzle-kit";

import { DB_LOCAL, DB_TEST } from "./src/db/constants";
// import env from "./src/lib/env";

const authToken = process.env.DB_AUTH_TOKEN || "default";

const remoteURL = process.env.DB_REMOTE || DB_LOCAL;
const url = process.env.NODE_ENV === "test" ? DB_TEST : remoteURL;

console.debug("Connecting to DB -", url);

export default defineConfig({
  dbCredentials: { authToken, url },
  dialect: "turso",
  out: "./src/db/migrations",
  schema: "./src/db/schema.ts",
  strict: true,
  verbose: true,
});
