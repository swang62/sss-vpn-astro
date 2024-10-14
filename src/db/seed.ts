import { execSync } from "node:child_process";
import fs from "node:fs";

import { DB_LOCAL_URL } from "../config/server";

export async function push() {
  console.debug("Pushing migrations...");

  fs.rmSync(DB_LOCAL_URL.replace("file:", ""), { force: true });
  execSync("pnpm drizzle-kit migrate");
}

export async function seed() {
  console.debug("Seeding database...");

  const { default: db, profile, users } = await import(".");

  await db.insert(users).values([
    { id: "1", name: "Steve" },
    { id: "2", name: "Bob" },
  ]);

  await db.insert(profile).values([
    { role: "admin", subscription_type: "premium", user_id: "1" },
    { role: "user", subscription_type: "trial", user_id: "2" },
  ]);
}

export async function remove() {
  console.debug("Deleting db...");

  fs.rmSync(DB_LOCAL_URL.replace("file:", ""), { force: true });
}
