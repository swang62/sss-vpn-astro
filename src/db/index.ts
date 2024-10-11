import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { DB_LOCAL } from "@/lib/constants";
import env from "@/lib/env";

import * as schema from "./schema";

console.debug("Connecting to DB -", env.DB_SYNC_URL);

const client = createClient({ syncUrl: env.DB_SYNC_URL, url: DB_LOCAL });
const db = drizzle(client, { schema });

// Export all subpaths
export default db;
export * from "./schema";
