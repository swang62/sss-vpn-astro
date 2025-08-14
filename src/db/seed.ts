import { hashPassword } from "better-auth/crypto";
import { execSync } from "node:child_process";
import fs from "node:fs";

// !!! Must use relative imports and conditional imports !!!
import { TEST_EMAIL } from "../config/constants";
import { DB_LOCAL_URL } from "../config/server";

export const TEST_USER = {
  banned: false,
  createdAt: new Date("2000-01-01T00:00:00.000Z"),
  email: TEST_EMAIL,
  emailVerified: true,
  id: "admin-id",
  name: "steve",
  role: "admin",
  updatedAt: new Date("2000-01-01T00:00:00.000Z"),
};

export async function push() {
  await remove();

  console.debug("Pushing migrations...");
  const result = execSync("pnpm drizzle-kit migrate");

  console.debug(result.toString());
}

export async function seed() {
  console.debug("Seeding database...");

  const { account, default: db, user } = await import("../db");
  const password = "password";
  const hash = await hashPassword(password);

  await db.insert(user).values([TEST_USER]);
  await db.insert(account).values([
    {
      accountId: TEST_USER.id,
      createdAt: TEST_USER.createdAt,
      id: "admin-account",
      password: hash,
      providerId: "credential",
      updatedAt: TEST_USER.updatedAt,
      userId: TEST_USER.id,
    },
  ]);
}

// Don't use this during testing as stripe is disabled
export async function seedProducts() {
  console.debug("Seeding products...");

  const { stripe } = await import("@/lib/server-clients");
  const { default: db, product } = await import(".");

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

    await db.insert(product).values([{ ...data, id: lookupKey }]).onConflictDoUpdate({
      set: data,
      target: product.id,
    });
  }
}

export async function remove() {
  console.debug(`Deleting ${DB_LOCAL_URL}...`);
  fs.rmSync(DB_LOCAL_URL.replace("file:", ""), { force: true });
}
