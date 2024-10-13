import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// ! Must use relative imports
import { DB_AUTH_TOKEN, DB_REMOTE, IS_TESTING } from "../lib/env";
import { DB_LOCAL, DB_TEST } from "./constants";
import * as schema from "./schema";

const authToken = DB_AUTH_TOKEN || "default";
const url = IS_TESTING ? DB_TEST : DB_LOCAL;

const syncUrl = IS_TESTING ? undefined : DB_REMOTE;
if (syncUrl) console.debug("Syncing to remote DB -", syncUrl);

const client = createClient({ authToken, syncInterval: 30, syncUrl, url });
const db = drizzle(client, { schema });

// Export all subpaths
export default db;
export * from "./schema";
