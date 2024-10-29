import type { HiddifyUser, SubscriptionType } from "@/config/types";
import type { User } from "@/lib/api-clients";

import db, { profile, type ProfileInsert } from "@/db";
import { axiosHiddify, stripe } from "@/lib/server-clients";

import { getProductByPriceId, searchHiddifyUser } from "./queries";

async function updateProfile(
  user: User,
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

  const data: ProfileInsert = subscription
    ? {
        hiddifyId,
        stripeCustomerId,
        subscriptionEndAt: new Date(subscription.current_period_end * 1000),
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

  await db.insert(profile).values([{ ...data, userId }]).onConflictDoUpdate({
    set: data,
    target: profile.userId,
  });

  console.debug(`Successfully updated profile for ${userId}`);
}

async function startFreeTrial(user: User, email: string, hiddifyId: string) {
  const userId = user.id;

  const customer = await stripe.customers.create({ email });
  if (!customer?.id) {
    throw new Error(`Profile failed, could not create profile for ${email}`);
  }

  // 3 day trial
  const now = new Date();
  const endDate = new Date(now);
  endDate.setDate(now.getDate() + 3);

  const data: ProfileInsert = {
    hiddifyId,
    stripeCustomerId: customer.id,
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

async function createHiddifyUser(email: string) {
  const body = {
    enable: true,
    mode: "no_reset",
    name: email,
    package_days: 3,
    start_date: new Date().toISOString().substring(0, 10),
    usage_limit_GB: 3,
  };
  const { data } = await axiosHiddify.post<HiddifyUser>("/admin/user", body);

  return data.uuid;
}

export async function setupNewUser(user: User) {
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
