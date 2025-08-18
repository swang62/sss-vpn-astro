import { hashPassword } from "better-auth/crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";

// !!! Must use relative imports and conditional imports !!!
import { DEFAULT_PASSWORD, TEST_ADMIN, TEST_USER } from "../config/constants";
import { DB_LOCAL_URL } from "../config/server";

const now = new Date("2000-01-01T00:00:00.000Z");

// Fake users to seed into dev/testing DB
export const adminUser = {
  banned: false,
  createdAt: now,
  email: TEST_ADMIN,
  emailVerified: true,
  id: "admin-id",
  name: "steve",
  role: "admin",
  updatedAt: now,
};
export const testUser = {
  banned: false,
  createdAt: now,
  email: TEST_USER,
  emailVerified: false,
  id: "user-id",
  name: "jenny",
  role: "user",
  updatedAt: now,
};

export async function deleteDB() {
  fs.rmSync(DB_LOCAL_URL.replace("file:", ""), { force: true });
  console.debug(`Deleted ${DB_LOCAL_URL}.`);
}

export async function migrate() {
  console.debug("Applying migrations...");
  const result = execSync("pnpm drizzle-kit migrate");
  console.debug(result.toString());
}

export async function seed() {
  console.debug("Seeding users...");

  const { account, default: db, user } = await import("../db");
  const password = await hashPassword(DEFAULT_PASSWORD);

  await db.insert(user).values([adminUser]);
  await db.insert(account).values([
    {
      accountId: adminUser.id,
      createdAt: adminUser.createdAt,
      id: `${adminUser.id}-account`,
      password,
      providerId: "credential",
      updatedAt: adminUser.updatedAt,
      userId: adminUser.id,
    },
  ]);

  await db.insert(user).values([testUser]);
  await db.insert(account).values([
    {
      accountId: testUser.id,
      createdAt: testUser.createdAt,
      id: `${testUser.id}-account`,
      password,
      providerId: "credential",
      updatedAt: testUser.updatedAt,
      userId: testUser.id,
    },
  ]);
}

// Don't use this during testing as stripe is disabled
export async function syncProducts() {
  console.debug("Seeding products...");

  const { stripe } = await import("../lib/payments");
  const { default: db, product } = await import("./index");

  const { data } = await stripe.prices.list();

  for (const price of data) {
    const priceId = price.id;

    // Don't update products without lookup keys or have been deleted
    const lookupKey = price.lookup_key?.toLowerCase().trim();
    if (!lookupKey || !price.active || price.deleted) continue;

    const data = {
      name: lookupKey,
      priceId,
      productId: price.product as string,
    };

    await db
      .insert(product)
      .values([{ ...data, id: lookupKey }])
      .onConflictDoUpdate({
        set: data,
        target: product.id,
      });
  }
}
