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

  const { default: db, profile, user } = await import(".");
  await db.insert(user).values([
    {
      banned: false,
      createdAt: new Date(),
      email: "test@test.com",
      id: "1",
      name: "test",
      role: "admin",
      updatedAt: new Date(),
    },
  ]);
  await db.insert(profile).values([
    {
      subscription: "premium",
      userId: "1",
    },
  ]);
}

export async function remove() {
  console.debug("Deleting db...");

  fs.rmSync(DB_LOCAL_URL.replace("file:", ""), { force: true });
}
