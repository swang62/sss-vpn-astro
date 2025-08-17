import { eq } from "drizzle-orm";

import type { HiddifyServerId, SubscriptionType } from "@/config/types";
import type { ProfileInsert } from "@/db";

import { MAX_NAME_LENGTH, TRIAL_TIME } from "@/config/constants";
import db, { profile as profileTable, user as userTable } from "@/db";
import { stripe } from "@/lib/server-clients";

import type { UserDB } from "./queries";

import { createHiddifyUser } from "./mutations-hiddify";
import { getProductByPriceId, searchForHiddifyEmail } from "./queries";

export async function updateIpAddress(user: UserDB, ip: string) {
  const userId = user.id;

  await db
    .update(profileTable)
    .set({ lastKnownIpAddress: ip })
    .where(eq(profileTable.userId, userId));
}

export async function updateUser(userId: string, name: string) {
  const nameFixed = name.length > MAX_NAME_LENGTH ? name.slice(0, MAX_NAME_LENGTH - 1) : name;
  const user = await db
    .update(userTable)
    .set({
      name: nameFixed,
    })
    .where(eq(userTable.id, userId))
    .returning();

  return user[0];
}

async function updateProfile(
  user: UserDB,
  stripeCustomerId: string,
  hiddifyId: string,
  hiddifyServerId: HiddifyServerId,
  ip: string
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
        hiddifyServerId,
        stripeCustomerId,
        subscriptionEndAt: isAutoRenew
          ? null
          : new Date(subscription.items.data[0].current_period_end * 1000),
        subscriptionId: subscription.id,
        subscriptionItemId: itemId,
        subscriptionStartAt: new Date(subscription.items.data[0].current_period_start * 1000),
        subscriptionType: product?.id as SubscriptionType,
      }
    : {
        hiddifyId,
        hiddifyServerId,
        stripeCustomerId,
        subscriptionType: "none" as SubscriptionType,
      };

  await db
    .insert(profileTable)
    .values([{ ...data, lastKnownIpAddress: ip, userId }])
    .onConflictDoUpdate({
      set: data,
      target: profileTable.userId,
    });

  console.debug(`Successfully updated profile for ${userId}`);
}

async function startFreeTrial(
  user: UserDB,
  email: string,
  hiddifyId: string,
  hiddifyServerId: HiddifyServerId,
  ip: string
) {
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
    hiddifyServerId,
    stripeCustomerId: customer.id,
    subscriptionEndAt: endDate,
    subscriptionId: null,
    subscriptionStartAt: now,
    subscriptionType: "trial" as SubscriptionType,
  };

  await db
    .insert(profileTable)
    .values([{ ...data, lastKnownIpAddress: ip, userId }])
    .onConflictDoUpdate({
      set: data,
      target: profileTable.userId,
    });

  console.debug(`Successfully created profile for ${userId}`);
}

// Profile is most likely missing for this route
export async function setupNewUser(user: UserDB, ip: string) {
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
  let hiddifyServerId = user.profile?.hiddifyServerId;
  if (!hiddifyId || !hiddifyServerId) {
    let data = await searchForHiddifyEmail(email);
    if (!data) data = await createHiddifyUser(email);

    hiddifyId = data.hiddifyId;
    hiddifyServerId = data.hiddifyServerId;
  }

  if (stripeCustomerId) {
    await updateProfile(user, stripeCustomerId, hiddifyId, hiddifyServerId, ip);
  } else {
    await startFreeTrial(user, email, hiddifyId, hiddifyServerId, ip);
  }
}
