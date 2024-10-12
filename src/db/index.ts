/* eslint-disable node/prefer-global/process */
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { DB_LOCAL, DB_TEST } from "./constants";
import * as schema from "./schema";

const isTesting = process.env.NODE_ENV === "test";

const syncUrl = isTesting ? undefined : process.env.DB_REMOTE;
const url = isTesting ? DB_TEST : DB_LOCAL;

if (syncUrl) console.debug("Syncing to remote DB -", syncUrl);

const client = createClient({ syncInterval: 30, syncUrl, url });
const db = drizzle(client, { schema });

// Export all subpaths
export default db;
export * from "./schema";
