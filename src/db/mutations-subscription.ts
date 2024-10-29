import type { PinoLogger } from "hono-pino";
import type Stripe from "stripe";

import { eq } from "drizzle-orm";

import type { SubscriptionType } from "@/config/types";

import { SITE_ADMIN, SITE_EMAIL } from "@/config/constants";
import db, { profile as profileTable } from "@/db";
import { postmarkClient, stripe } from "@/lib/server-clients";

import { getProductByPriceId, getProfileByStripeId } from "./queries";

export async function setSubscriptionRenew(subscriptionId: string, isAutoRenew: boolean) {
  await stripe.subscriptions.update(
    subscriptionId,
    { cancel_at_period_end: !isAutoRenew },
  );
}

export async function updateProfileSubscription(subscription: Stripe.Subscription) {
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
    // Auto-renew has no end date
    await db.update(profileTable).set({
      subscriptionEndAt: isAutoRenew ? null : subscriptionEndAt,
      subscriptionId,
      subscriptionItemId,
      subscriptionStartAt,
      subscriptionType,
    }).where(eq(profileTable.stripeCustomerId, stripeCustomerId));
  }
}

export async function cancelProfileSubscription(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const stripeCustomerId = subscription.customer as string;
  const profile = await getProfileByStripeId(stripeCustomerId);
  const status = subscription.status;

  if (status === "canceled" && profile?.subscriptionId === subscriptionId) {
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
    await db.update(profileTable).set({
      purchasedRouter: true,
    }).where(eq(profileTable.stripeCustomerId, stripeCustomerId));

    if (postmarkClient) {
      postmarkClient.sendEmailWithTemplate({
        Bcc: SITE_ADMIN,
        From: SITE_EMAIL,
        TemplateAlias: "router",
        TemplateModel: {},
        To: profile?.user.email,
      });
    }

    logger.debug(`Sent router email to ${profile?.user.email}`);
  }
}
