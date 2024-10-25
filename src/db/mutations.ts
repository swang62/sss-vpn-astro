import type Stripe from "stripe";

import type { SubscriptionType } from "@/lib/types";

import db, { profile, type User } from "@/db";
import { stripe } from "@/lib/context";

export async function updateSubscription(
  userId: string,
  stripeCustomerId: string,
  subscription?: Stripe.Subscription,
) {
  const subscriptionType =
    (subscription?.items.data[0]?.price.lookup_key as SubscriptionType) ??
    "none";

  const data = {
    stripeCustomerId,
    subscriptionEndAt: subscription
      ? new Date(subscription.current_period_end * 1000)
      : null,
    subscriptionId: subscription ? subscription.id : null,
    subscriptionStartAt: subscription
      ? new Date(subscription.current_period_start * 1000)
      : null,
    subscriptionType,
    userId,
  };

  // Add subscription if it exists
  await db.insert(profile).values([data]).onConflictDoUpdate({
    set: data,
    target: profile.userId,
  });
}

export async function updateUserProfile(
  userId: string,
  stripeCustomerId: string,
) {
  const customer = await stripe.customers.retrieve(stripeCustomerId, {
    expand: ["subscriptions"],
  });
  if (customer.deleted) return;

  await updateSubscription(
    userId,
    stripeCustomerId,
    customer.subscriptions?.data[0],
  );
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

  // User has already been setup but is somehow missing data
  if (stripeCustomerId) {
    await updateUserProfile(userId, stripeCustomerId);
    return;
  }

  const customer = await stripe.customers.create({ email });
  if (!customer?.id) {
    throw new Error(`Could not create stripe customer for ${email}`);
  }

  // Sign them up for free trial
  stripeCustomerId = customer.id;
  const subscription = await stripe.subscriptions.create({
    cancel_at_period_end: true,
    customer: stripeCustomerId,
    items: [
      {
        price: "price_1QDiWIFr5myvOSqHhjDnKpE6",
      },
    ],
  });

  await updateSubscription(userId, stripeCustomerId, subscription);
}
