import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "@/lib/env";

import * as schema from "./schema";

console.debug("Connecting to DB -", env.DB_PATH);

const client = createClient({ url: env.DB_PATH });
const db = drizzle(client, { schema });

export default db;
