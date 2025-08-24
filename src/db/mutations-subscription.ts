import type { PinoLogger } from "hono-pino";
import type Stripe from "stripe";

import { eq } from "drizzle-orm";

import {
  DATA_PACKAGE_PRICE,
  PLAN_LIMITS,
  SITE_ADMIN,
  SITE_EMAIL,
} from "@/config/constants";
import db, { profile as profileTable } from "@/db";
import { postmarkClient } from "@/lib/email";
import { stripe } from "@/lib/stripe";

import {
  cancelHiddifyPlan,
  increaseUsageLimit,
  updateHiddifyUser,
} from "./mutations-hiddify";
import {
  getHiddifyUserById,
  getProductByPriceId,
  getProfileByStripeId,
} from "./queries";

export async function setSubscriptionRenew(
  subscriptionId: string,
  isAutoRenew: boolean
) {
  await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: !isAutoRenew,
  });
}

export async function updateSubscription(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const subscriptionStartAt = new Date(
    subscription.items.data[0].current_period_start * 1000
  );
  const subscriptionEndAt = new Date(
    subscription.items.data[0].current_period_end * 1000
  );
  const status = subscription.status;
  const isAutoRenew = !subscription.cancel_at_period_end;

  let subscriptionItemId;
  let subscriptionType;
  for (const item of subscription.items.data) {
    const priceId = item.price.id;
    const product = await getProductByPriceId(priceId);
    if (product) {
      subscriptionType = product.id;
      subscriptionItemId = item.id;
    }
  }

  if (status === "active") {
    const profile = await getProfileByStripeId(stripeCustomerId);
    if (!profile || !profile.hiddifyId) {
      throw new Error(`Subscription update failed for ${stripeCustomerId}`);
    }

    await updateHiddifyUser(
      profile.hiddifyId,
      profile.hiddifyServerId,
      subscriptionStartAt,
      subscriptionType,
      isAutoRenew
    );
    await db
      .update(profileTable)
      .set({
        subscriptionEndAt: isAutoRenew ? null : subscriptionEndAt,
        subscriptionId,
        subscriptionItemId,
        subscriptionStartAt,
        subscriptionType,
      })
      .where(eq(profileTable.stripeCustomerId, stripeCustomerId));
  }
}

export async function cancelSubscription(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const stripeCustomerId = subscription.customer as string;
  const status = subscription.status;
  const profile = await getProfileByStripeId(stripeCustomerId);
  if (!profile || !profile.hiddifyId)
    throw new Error(`Subscription cancellation failed for ${stripeCustomerId}`);

  if (status === "canceled" && profile.subscriptionId === subscriptionId) {
    await cancelHiddifyPlan(profile.hiddifyId, profile.hiddifyServerId);
    await db
      .update(profileTable)
      .set({
        subscriptionEndAt: null,
        subscriptionId: null,
        subscriptionItemId: null,
        subscriptionStartAt: null,
        subscriptionType: "none",
      })
      .where(eq(profileTable.stripeCustomerId, stripeCustomerId));
  }
}

export async function handleItemPurchases(
  stripeCustomerId: string,
  invoice: Stripe.Invoice,
  logger: PinoLogger
) {
  const lineItems = invoice.lines.data;

  let purchasedRouter = false;
  let purchasedDataPlan = false;
  let totalSpent = 0;
  for (const item of lineItems) {
    const priceId = item.pricing?.price_details?.price;
    const product = await getProductByPriceId(priceId);
    if (product?.id === "router") {
      purchasedRouter = true;
    }

    const unitPrice = Number(item.pricing?.unit_amount_decimal);
    if (unitPrice === DATA_PACKAGE_PRICE * 100) {
      purchasedDataPlan = true;
      totalSpent += Number(item.amount || 0) / 100;
    }
  }

  if (purchasedRouter) {
    const profile = await getProfileByStripeId(stripeCustomerId);
    if (!profile)
      throw new Error(`Router setup failed for ${stripeCustomerId}`);

    await db
      .update(profileTable)
      .set({
        purchasedRouter: true,
      })
      .where(eq(profileTable.stripeCustomerId, stripeCustomerId));

    if (postmarkClient) {
      postmarkClient.sendEmailWithTemplate({
        Cc: SITE_ADMIN,
        From: SITE_EMAIL,
        TemplateAlias: "router",
        TemplateModel: {},
        To: profile.user.email,
      });
    }

    logger.debug(`Sent router purchased email to ${profile.user.email}`);
  }

  if (purchasedDataPlan) {
    const profile = await getProfileByStripeId(stripeCustomerId);
    if (!profile?.subscriptionId)
      throw new Error(`No active subscription for ${stripeCustomerId}`);

    const currentPlan = profile.subscriptionType;
    const GBPerDollar =
      PLAN_LIMITS[currentPlan].data / PLAN_LIMITS[currentPlan].price;
    const dataPurchased = totalSpent * GBPerDollar;

    const usage = await getHiddifyUserById(
      profile.hiddifyId,
      profile.hiddifyServerId
    );
    const currentLimit = usage?.usage_limit_GB ?? PLAN_LIMITS[currentPlan].data;
    const newLimit = currentLimit + dataPurchased;

    await increaseUsageLimit(
      profile.hiddifyId,
      profile.hiddifyServerId,
      newLimit
    );
    logger.debug(
      `Increased usage limit from ${currentLimit} to ${newLimit} for ${profile.user.email}`
    );
  }
}
