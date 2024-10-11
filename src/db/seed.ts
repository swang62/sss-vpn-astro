import { execSync } from "node:child_process";
import fs from "node:fs";

import { DB_LOCAL, DB_TEST } from "@/lib/constants";
import env from "@/lib/env";

const url = env.NODE_ENV === "test" ? DB_TEST : DB_LOCAL;

export async function push() {
  console.info("Pushing migrations...");

  fs.rmSync(url.replace("file:", ""), { force: true });
  execSync("pnpm drizzle-kit migrate");
}

export async function seed() {
  console.info("Seeding database...");

  import(".").then(async (schema) => {
    const { default: db, profile, users } = schema;

    await db.insert(users).values([
      { id: "1", name: "Steve" },
      { id: "2", name: "Bob" },
    ]);

    await db.insert(profile).values([
      { role: "admin", subscription_type: "premium", user_id: "1" },
      { role: "user", subscription_type: "trial", user_id: "2" },
    ]);
  });
}

export async function remove() {
  console.info("Deleting db...");

  fs.rmSync(url.replace("file:", ""), { force: true });
}
