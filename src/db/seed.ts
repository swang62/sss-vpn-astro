import { hashPassword } from "better-auth/crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";

// !!! Must use relative imports !!!
import { SITE_ADMIN } from "../config/constants";
import { DB_LOCAL_URL } from "../config/server";
import { account } from "./schema";

export const TEST_USER = {
  banned: false,
  createdAt: new Date(),
  email: SITE_ADMIN,
  emailVerified: true,
  id: "admin-id",
  name: "steve",
  role: "admin",
  updatedAt: new Date(),
};

export async function push() {
  await remove();

  console.debug("Pushing migrations...");
  execSync("pnpm drizzle-kit migrate");
}

export async function seed() {
  console.debug("Seeding database...");

  const { default: db, user } = await import(".");
  const password = "password";
  const hash = await hashPassword(password);

  await db.insert(user).values([TEST_USER]);
  await db.insert(account).values([
    {
      accountId: TEST_USER.id,
      expiresAt: new Date("2050-01-01T00:00:00.000Z"),
      id: "admin-account",
      password: hash,
      providerId: "credential",
      userId: TEST_USER.id,
    },
  ]);
}

export async function remove() {
  console.debug(`Deleting ${DB_LOCAL_URL}...`);
  fs.rmSync(DB_LOCAL_URL.replace("file:", ""), { force: true });
}
