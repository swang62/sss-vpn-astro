import { drizzle } from "drizzle-orm/libsql";

// !!! Must use relative imports !!!
import { DB_AUTH_TOKEN, DB_LOCAL_URL, DB_SYNC_URL } from "../config/server";
import * as schema from "./schema";

if (DB_SYNC_URL) {
  console.debug("Syncing to remote DB:", DB_SYNC_URL);
}

console.debug("Connecting to DB:", DB_LOCAL_URL);

// Setup db client
const db = drizzle({
  connection: {
    authToken: DB_AUTH_TOKEN,
    syncInterval: 10,
    syncUrl: DB_SYNC_URL,
    url: DB_LOCAL_URL,
  },
  schema,
});

// Export all subpaths
export default db;
export * from "./schema";
