import { eq } from "drizzle-orm";

import type { SubscriptionType } from "@/config/types";

import { MAX_NAME_LENGTH, TRIAL_TIME } from "@/config/constants";
import db, { type ProfileInsert, profile as profileTable, user as userTable } from "@/db";
import { stripe } from "@/lib/server-clients";

import { createHiddifyUser } from "./mutations-hiddify";
import { getProductByPriceId, searchHiddifyUser, type UserDB } from "./queries";

export async function updateStripeName(stripeCustomerId: string, name: string) {
  await stripe.customers.update(stripeCustomerId, { name });
}

export async function updateUser(
  userId: string,
  name: string,
) {
  const nameFixed = name.length > MAX_NAME_LENGTH ? name.slice(0, MAX_NAME_LENGTH - 1) : name;

  const user = await db.update(userTable).set({
    name: nameFixed,
  }).where(eq(userTable.id, userId)).returning();

  return user[0];
}

async function updateProfile(
  user: UserDB,
  stripeCustomerId: string,
  hiddifyId: string,
) {
  const userId = user.id;

  const customer = await stripe.customers.retrieve(stripeCustomerId, { expand: ["subscriptions"] });
  if (customer.deleted) return;

  const subscription = customer.subscriptions?.data[0];
  const itemId = subscription?.items.data[0]?.id;
  const priceId = subscription?.items.data[0]?.price.id;
  const product = await getProductByPriceId(priceId);
  const isAutoRenew = !subscription?.cancel_at_period_end;

  const data: ProfileInsert = subscription
    ? {
        hiddifyId,
        stripeCustomerId,
        subscriptionEndAt: isAutoRenew ? null : new Date(subscription.current_period_end * 1000),
        subscriptionId: subscription.id,
        subscriptionItemId: itemId,
        subscriptionStartAt: new Date(subscription.current_period_start * 1000),
        subscriptionType: product?.id as SubscriptionType,
      }
    : {
        hiddifyId,
        stripeCustomerId,
        subscriptionType: "none" as SubscriptionType,
      };

  await db.insert(profileTable).values([{ ...data, userId }]).onConflictDoUpdate({
    set: data,
    target: profileTable.userId,
  });

  console.debug(`Successfully updated profile for ${userId}`);
}

async function startFreeTrial(user: UserDB, email: string, hiddifyId: string) {
  const userId = user.id;

  const customer = await stripe.customers.create({ email, name: user.name });
  if (!customer?.id) {
    throw new Error(`Profile failed, could not create profile for ${email}`);
  }

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + TRIAL_TIME);

  const data: ProfileInsert = {
    hiddifyId,
    stripeCustomerId: customer.id,
    subscriptionEndAt: endDate,
    subscriptionId: null,
    subscriptionStartAt: now,
    subscriptionType: "trial" as SubscriptionType,
  };

  await db.insert(profileTable).values([{ ...data, userId }]).onConflictDoUpdate({
    set: data,
    target: profileTable.userId,
  });

  console.debug(`Successfully created profile for ${userId}`);
}

// Profile is most likely missing for this route
export async function setupNewUser(user: UserDB) {
  const email = user.email;

  // Validate stripe user
  let stripeCustomerId = user.profile?.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.search({
      query: `email:"${email}"`,
    });
    stripeCustomerId = customer.data[0]?.id;
  }

  // Validate hiddify account
  let hiddifyId = user.profile?.hiddifyId;
  if (!hiddifyId) {
    hiddifyId = await searchHiddifyUser(email);
    if (!hiddifyId) {
      hiddifyId = await createHiddifyUser(email);
    }
  }

  if (stripeCustomerId) {
    await updateProfile(user, stripeCustomerId, hiddifyId);
  } else {
    await startFreeTrial(user, email, hiddifyId);
  }
}
