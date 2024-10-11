import { execSync } from "node:child_process";
import fs from "node:fs";

import env from "@/lib/env";

import { DB_LOCAL, DB_TEST } from "./constants";

const url = env.NODE_ENV === "test" ? DB_TEST : DB_LOCAL;

export async function push() {
  console.debug("Pushing migrations...");

  fs.rmSync(url.replace("file:", ""), { force: true });
  execSync("pnpm drizzle-kit migrate");
}

export async function seed() {
  console.debug("Seeding database...");

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
  console.debug("Deleting db...");

  fs.rmSync(url.replace("file:", ""), { force: true });
}
