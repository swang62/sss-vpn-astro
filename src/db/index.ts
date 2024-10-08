import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import env from "@/types";

import * as schema from "./schema";

console.debug("Connecting to -", env._databaseUrl);

const client = createClient({ url: env._databaseUrl });
const db = drizzle(client, { schema });

export default db;
