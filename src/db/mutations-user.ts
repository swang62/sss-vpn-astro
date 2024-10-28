import type { SubscriptionType } from "@/config/types";
import type { User } from "@/lib/api-clients";

import db, { profile, type ProfileInsert } from "@/db";
import { stripe } from "@/lib/context";

import { getProductByPriceId } from "./queries";

export async function updateProfile(
  userId: string,
  stripeCustomerId: string,
) {
  const customer = await stripe.customers.retrieve(stripeCustomerId, { expand: ["subscriptions"] });
  if (customer.deleted) return;

  const subscription = customer.subscriptions?.data[0];
  const itemId = subscription?.items.data[0]?.id;
  const priceId = subscription?.items.data[0]?.price.id;
  const product = await getProductByPriceId(priceId);

  const data: ProfileInsert = subscription
    ? {
        stripeCustomerId,
        subscriptionEndAt: new Date(subscription.current_period_end * 1000),
        subscriptionId: subscription.id,
        subscriptionItemId: itemId,
        subscriptionStartAt: new Date(subscription.current_period_start * 1000),
        subscriptionType: product?.id as SubscriptionType,
      }
    : {
        stripeCustomerId,
        subscriptionType: "none" as SubscriptionType,
      };

  await db.insert(profile).values([{ ...data, userId }]).onConflictDoUpdate({
    set: data,
    target: profile.userId,
  });

  console.debug(`Successfully updated profile for ${userId}`);
}

export async function setupNewUser(user: User) {
  const userId = user.id;
  const email = user.email;

  let stripeCustomerId = user.profile?.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.search({
      query: `email:"${email}"`,
    });
    stripeCustomerId = customer.data[0]?.id;
  }

  if (stripeCustomerId) {
    await updateProfile(userId, stripeCustomerId);
  } else {
    await startFreeTrial(userId, email);
  }
}

export async function startFreeTrial(userId: string, email: string) {
  const customer = await stripe.customers.create({ email });
  if (!customer?.id) {
    throw new Error(`Profile failed, could not create profile for ${email}`);
  }
  const stripeCustomerId = customer.id;

  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 3);

  const data: ProfileInsert = {
    stripeCustomerId,
    subscriptionEndAt: endDate,
    subscriptionId: null,
    subscriptionStartAt: now,
    subscriptionType: "trial" as SubscriptionType,
  };

  await db.insert(profile).values([{ ...data, userId }]).onConflictDoUpdate({
    set: data,
    target: profile.userId,
  });

  console.debug(`Successfully created profile for ${userId}`);
}
