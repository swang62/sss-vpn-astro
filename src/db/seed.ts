import { hashPassword } from "better-auth/crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";

// !!! Must use relative imports !!!
import { SITE_ADMIN } from "../config/constants";
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
      email: SITE_ADMIN,
      emailVerified: true,
      id,
      name: "admin",
      role: "admin",
      updatedAt: new Date(),
    },
  ]);
  await db.insert(account).values([
    {
      accountId: id,
      expiresAt: new Date("2050-01-01T00:00:00.000Z"),
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
