import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// !!! Must use relative imports !!!
import { DB_SYNC_INTERVAL } from "../config/constants";
import { DB_AUTH_TOKEN, DB_LOCAL_URL, DB_SYNC_URL } from "../config/server";
import * as schema from "./schema";

if (DB_SYNC_URL) console.debug("Syncing to remote DB -", DB_SYNC_URL);

const client = createClient({
  authToken: DB_AUTH_TOKEN,
  syncInterval: DB_SYNC_INTERVAL,
  syncUrl: DB_SYNC_URL,
  url: DB_LOCAL_URL,
});
const db = drizzle(client, { schema });

// Export all subpaths
export default db;
export * from "./schema";
