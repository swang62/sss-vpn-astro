// !!! MUST USE relative imports and conditional imports !!!
import { execSync } from "node:child_process";
import fs from "node:fs";
import { hashPassword } from "better-auth/crypto";
import { DEFAULT_PASSWORD, TEST_ADMIN, TEST_USER } from "../config/constants";
import { DB_LOCAL_URL } from "../config/server";
import { PAID_PLANS, type PaidPlan } from "../config/types";
import { capitalize } from "../lib/utils";

import type { ProfileInsert } from "./index";

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

// Seed fake products and profiles directly into the test DB (no external API calls)
export async function seedMockTables() {
  const {
    TEST_HIDDIFY_ID_ADMIN,
    TEST_HIDDIFY_ID_USER,
    TEST_STRIPE_CUSTOMER_ID_ADMIN,
    TEST_STRIPE_CUSTOMER_ID_USER,
    TEST_USER_IP,
    TEST_STRIPE_SUBSCRIPTION_ID,
    TEST_STRIPE_SUBSCRIPTION_ITEM_ID,
    TEST_PRODUCT_IDS,
  } = await import("../__tests__/constants");

  const {
    default: db,
    product: productTable,
    profile: profileTable,
  } = await import("./index");

  const now = new Date();
  const monthMs = 30 * 24 * 60 * 60 * 1000;

  const productData = [
    { id: "basic" as const, ...TEST_PRODUCT_IDS.basic },
    { id: "pro" as const, ...TEST_PRODUCT_IDS.pro },
    { id: "premium" as const, ...TEST_PRODUCT_IDS.premium },
    { id: "router" as const, ...TEST_PRODUCT_IDS.router },
  ];
  for (const p of productData) {
    await db
      .insert(productTable)
      .values([
        { ...p, name: `${p.id.charAt(0).toUpperCase() + p.id.slice(1)} Plan` },
      ])
      .onConflictDoNothing({ target: productTable.id });
  }

  const profiles: (ProfileInsert & { userId: string })[] = [
    {
      hiddifyId: TEST_HIDDIFY_ID_ADMIN,
      hiddifyServerId: "1",
      lastKnownIpAddress: TEST_USER_IP,
      stripeCustomerId: TEST_STRIPE_CUSTOMER_ID_ADMIN,
      subscriptionEndAt: new Date(now.getTime() + monthMs),
      subscriptionId: TEST_STRIPE_SUBSCRIPTION_ID,
      subscriptionItemId: TEST_STRIPE_SUBSCRIPTION_ITEM_ID,
      subscriptionStartAt: now,
      subscriptionType: "pro",
      userId: adminUser.id,
    },
    {
      hiddifyId: TEST_HIDDIFY_ID_USER,
      hiddifyServerId: "1",
      lastKnownIpAddress: TEST_USER_IP,
      stripeCustomerId: TEST_STRIPE_CUSTOMER_ID_USER,
      subscriptionEndAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      subscriptionStartAt: now,
      subscriptionType: "trial",
      userId: testUser.id,
    },
  ];

  for (const p of profiles) {
    await db
      .insert(profileTable)
      .values([p])
      .onConflictDoNothing({ target: profileTable.hiddifyId });
  }

  console.debug("Seeded mock product and profile tables for testing.");
}

// Don't use this during testing as stripe is disabled
export async function syncProducts() {
  console.debug("Seeding products...");

  const { stripe } = await import("../lib/stripe");
  const { default: db, product: productTable } = await import("./index");

  const { data } = await stripe.prices.list();

  for (const price of data) {
    const priceId = price.id;

    // Don't update products without lookup keys or have been deleted
    const lookupKey = price.lookup_key?.toLowerCase().trim();
    if (
      !PAID_PLANS.includes(lookupKey as PaidPlan) ||
      !price.active ||
      price.deleted
    ) {
      continue;
    }

    const data = {
      name: `${capitalize(lookupKey)} Plan`,
      priceId,
      productId: price.product as string,
    };

    await db
      .insert(productTable)
      .values([{ ...data, id: lookupKey as PaidPlan }])
      .onConflictDoUpdate({
        set: data,
        target: productTable.id,
      });
  }
}
