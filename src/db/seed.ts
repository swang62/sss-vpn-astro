import { hashPassword } from "better-auth/crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";

import { DB_LOCAL_URL } from "../config/server";
import { account } from "./schema";

export async function push() {
  console.debug("Pushing migrations...");

  fs.rmSync(DB_LOCAL_URL.replace("file:", ""), { force: true });
  execSync("pnpm drizzle-kit migrate");
}

export async function seed() {
  console.debug("Seeding database...");

  const { default: db, profile, user } = await import(".");
  const password = "password";
  const hash = await hashPassword(password);
  const id = "1";
  await db.insert(user).values([
    {
      banned: false,
      createdAt: new Date(),
      email: "admin@sssvpn.com",
      id,
      name: "admin",
      role: "admin",
      updatedAt: new Date(),
    },
  ]);
  await db.insert(account).values([
    {
      accountId: id,
      expiresAt: new Date("2034-10-23T09:40:47.547Z"),
      id,
      password: hash,
      providerId: "credential",
      userId: id,
    },
  ]);
  await db.insert(profile).values([
    {
      subscription: "premium",
      userId: id,
    },
  ]);
}

export async function remove() {
  console.debug("Deleting db...");

  fs.rmSync(DB_LOCAL_URL.replace("file:", ""), { force: true });
}
