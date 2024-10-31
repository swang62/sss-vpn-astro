import type { PinoLogger } from "hono-pino";
import type Stripe from "stripe";

import { eq } from "drizzle-orm";

import type { SubscriptionType } from "@/config/types";

import { SITE_ADMIN, SITE_EMAIL } from "@/config/constants";
import db, { profile as profileTable } from "@/db";
import { postmarkClient, stripe } from "@/lib/server-clients";

import { cancelHiddifyUser, updateHiddifyUser } from "./mutations-hiddify";
import { getProductByPriceId, getProfileByStripeId } from "./queries";

export async function setSubscriptionRenew(subscriptionId: string, isAutoRenew: boolean) {
  await stripe.subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: !isAutoRenew },
  );
}

export async function updateSubscription(subscription: Stripe.Subscription) {
  const stripeCustomerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const subscriptionStartAt = new Date(subscription.current_period_start * 1000);
  const subscriptionEndAt = new Date(subscription.current_period_end * 1000);
  const status = subscription.status;
  const isAutoRenew = !subscription.cancel_at_period_end;

  let subscriptionItemId = "";
  let subscriptionType: SubscriptionType = "none";
  for (const item of subscription.items.data) {
    const priceId = item.price.id;
    const product = await getProductByPriceId(priceId);
    if (product && product.id !== "router") {
      subscriptionType = product.id as SubscriptionType;
      subscriptionItemId = item.id;
    }
  }

  if (status === "active") {
    const profile = await getProfileByStripeId(stripeCustomerId);
    if (!profile || !profile.hiddifyId) throw new Error(`Subscription update failed for ${stripeCustomerId}`);

    await updateHiddifyUser(profile.hiddifyId, subscriptionStartAt, subscriptionType, isAutoRenew);
    await db.update(profileTable).set({
      subscriptionEndAt: isAutoRenew ? null : subscriptionEndAt,
      subscriptionId,
      subscriptionItemId,
      subscriptionStartAt,
      subscriptionType,
    }).where(eq(profileTable.stripeCustomerId, stripeCustomerId));
  }
}

export async function cancelSubscription(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const stripeCustomerId = subscription.customer as string;
  const status = subscription.status;
  const profile = await getProfileByStripeId(stripeCustomerId);
  if (!profile || !profile.hiddifyId) throw new Error(`Subscription cancellation failed for ${stripeCustomerId}`);

  if (status === "canceled" && profile.subscriptionId === subscriptionId) {
    await cancelHiddifyUser(profile.hiddifyId);
    await db.update(profileTable).set({
      subscriptionEndAt: null,
      subscriptionId: null,
      subscriptionItemId: null,
      subscriptionStartAt: null,
      subscriptionType: "none",
    }).where(eq(profileTable.stripeCustomerId, stripeCustomerId));
  }
}

export async function handleRouterPurchase(stripeCustomerId: string, session: Stripe.Checkout.Session, logger: PinoLogger) {
  const invoiceId = session.invoice as string;
  const invoice = await stripe.invoices.retrieve(invoiceId);
  const lineItems = invoice.lines.data;

  let purchasedRouter = false;
  for (const item of lineItems) {
    const priceId = item.price?.id;
    const product = await getProductByPriceId(priceId);
    if (product && product.id === "router") {
      purchasedRouter = true;
    }
  }

  if (purchasedRouter) {
    const profile = await getProfileByStripeId(stripeCustomerId);
    if (!profile) throw new Error(`Router setup failed for ${stripeCustomerId}`);

    await db.update(profileTable).set({
      purchasedRouter: true,
    }).where(eq(profileTable.stripeCustomerId, stripeCustomerId));

    if (postmarkClient) {
      postmarkClient.sendEmailWithTemplate({
        Bcc: SITE_ADMIN,
        From: SITE_EMAIL,
        TemplateAlias: "router",
        TemplateModel: {},
        To: profile.user.email,
      });
    }

    logger.debug(`Sent router email to ${profile.user.email}`);
  }
}
