import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "@/lib/env";

import { DB_LOCAL, DB_TEST } from "./constants";
import * as schema from "./schema";

console.debug("Syncing to remote DB -", env.DB_SYNC_URL);

const url = env.NODE_ENV === "test" ? DB_TEST : DB_LOCAL;

const client = createClient({ syncUrl: env.DB_SYNC_URL, url });
const db = drizzle(client, { schema });

// Export all subpaths
export default db;
export * from "./schema";
