import { eq } from "drizzle-orm";
import { MAX_NAME_LENGTH, TRIAL_TIME } from "@/config/constants";
import type { SubscriptionType } from "@/config/types";
import type { ProfileInsert } from "@/db";
import db, { profile as profileTable, user as userTable } from "@/db";
import { stripe } from "@/lib/stripe";
import { createHiddifyUser } from "./mutations-hiddify";
import type { UserDB } from "./queries";
import { searchForHiddifyEmail } from "./queries";

export async function updateIpAddress(user: UserDB, ip: string) {
  const userId = user.id;

  await db
    .update(profileTable)
    .set({ lastKnownIpAddress: ip })
    .where(eq(profileTable.userId, userId));
}

export async function updateUser(userId: string, name: string) {
  const nameFixed =
    name.length > MAX_NAME_LENGTH ? name.slice(0, MAX_NAME_LENGTH - 1) : name;
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
  ip: string
) {
  const userId = user.id;

  const customer = await stripe.customers.retrieve(stripeCustomerId, {
    expand: ["subscriptions"],
  });
  if (customer.deleted) return;

  const subscription = customer.subscriptions?.data[0];
  const itemId = subscription?.items.data[0]?.id;
  const lookupKey = subscription?.items.data[0]?.price.lookup_key;
  const isAutoRenew = !subscription?.cancel_at_period_end;

  const data: ProfileInsert = subscription
    ? {
        hiddifyId,
        stripeCustomerId,
        subscriptionEndAt: isAutoRenew
          ? null
          : new Date(subscription.items.data[0].current_period_end * 1000),
        subscriptionId: subscription.id,
        subscriptionItemId: itemId,
        subscriptionStartAt: new Date(
          subscription.items.data[0].current_period_start * 1000
        ),
        subscriptionType: (lookupKey ?? "none") as SubscriptionType,
      }
    : {
        hiddifyId,
        stripeCustomerId,
        subscriptionType: "none",
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
    stripeCustomerId: customer.id,
    subscriptionEndAt: endDate,
    subscriptionId: null,
    subscriptionStartAt: now,
    subscriptionType: "trial",
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
  if (!hiddifyId) {
    let data = await searchForHiddifyEmail(email);
    if (!data) data = await createHiddifyUser(email);
    hiddifyId = data.hiddifyId;
  }

  if (stripeCustomerId) {
    await updateProfile(user, stripeCustomerId, hiddifyId, ip);
  } else {
    await startFreeTrial(user, email, hiddifyId, ip);
  }
}
