import type Stripe from "stripe";

import { eq } from "drizzle-orm";

import type { SubscriptionType } from "@/config/types";

import { SITE_ADMIN, SITE_EMAIL } from "@/config/constants";
import db, { profile as profileTable } from "@/db";
import { postmarkClient, stripe } from "@/lib/context";

import { getProductByPriceId, getProfileByStripeId } from "./queries";

export async function setSubscriptionRenew(subscriptionId: string, isAutoRenew: boolean) {
  await stripe.subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: !isAutoRenew },
  );
}

export async function updateProfileSubscription(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const stripeCustomerId = subscription.customer as string;
  const subscriptionStartAt = new Date(subscription.current_period_start * 1000);
  const subscriptionEndAt = new Date(subscription.current_period_end * 1000);
  const status = subscription.status;
  const insertAt = eq(profileTable.stripeCustomerId, stripeCustomerId);

  let purchasedRouter = false;
  let subscriptionType: SubscriptionType = "none";
  for (const item of subscription.items.data) {
    const priceId = item.price.id;
    const product = await getProductByPriceId(priceId);
    if (product) {
      if (product.id !== "router") {
        subscriptionType = product.id as SubscriptionType;
      } else if (product.id === "router") {
        purchasedRouter = true;
      }
    }
  }

  if (status === "active") {
    const isAutoRenew = !subscription.cancel_at_period_end;
    if (isAutoRenew) {
      // Auto-renew has no end date
      await db.update(profileTable).set({
        subscriptionEndAt: null,
        subscriptionId,
        subscriptionStartAt,
        subscriptionType,
      }).where(insertAt);
    } else {
      // End date implies no renewal
      await db.update(profileTable).set({
        subscriptionEndAt,
        subscriptionId,
        subscriptionStartAt,
        subscriptionType,
      }).where(insertAt);
    }
  } else if (status === "canceled") {
    await db.update(profileTable).set({
      subscriptionEndAt: null,
      subscriptionId: null,
      subscriptionStartAt: null,
      subscriptionType: "none",
    }).where(insertAt);
  }

  if (purchasedRouter) {
    const profile = await getProfileByStripeId(stripeCustomerId);
    await db.update(profileTable).set({
      purchasedRouter: true,
    }).where(insertAt);

    if (postmarkClient) {
      postmarkClient.sendEmailWithTemplate({
        Bcc: SITE_ADMIN,
        From: SITE_EMAIL,
        TemplateAlias: "router",
        TemplateModel: {},
        To: profile?.user.email,
      });
    }

    console.debug(`Sent router email to ${profile?.user.email}`);
  }

  console.debug(`Successfully updated subscription for ${stripeCustomerId}`);
}
