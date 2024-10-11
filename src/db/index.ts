import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { DB_LOCAL, DB_TEST } from "@/lib/constants";
import env from "@/lib/env";

import * as schema from "./schema";

const url = env.NODE_ENV === "test" ? DB_TEST : DB_LOCAL;
// console.debug("Syncing to remote DB -", env.DB_SYNC_URL);

const client = createClient({ syncUrl: env.DB_SYNC_URL, url });
const db = drizzle(client, { schema });

// Export all subpaths
export default db;
export * from "./schema";
