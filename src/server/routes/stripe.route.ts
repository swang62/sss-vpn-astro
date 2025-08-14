import type Stripe from "stripe";

import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { SITE_URL } from "@/config/client";
import { DATA_PACKAGE_PRICE, PLAN_LIMITS } from "@/config/constants";
import { STRIPE_WEBHOOK_SECRET } from "@/config/server";
import { FREE_PLANS, PAID_PLANS } from "@/config/types";
import { resetUsageLimit } from "@/db/mutations-hiddify";
import { updateProduct } from "@/db/mutations-product";
import { cancelSubscription, handleItemPurchases, setSubscriptionRenew, updateSubscription } from "@/db/mutations-subscription";
import { updateUser } from "@/db/mutations-user";
import { getProductByKey, getProfileByStripeId } from "@/db/queries";
import { stripe } from "@/lib/server-clients";
import { createBaseRouter } from "@/server/app";

import { getAuthenticatedUser } from "../middleware";

// All stripe routes must be authenticated

const route = createBaseRouter()
  .post("/checkout", zValidator(
    "json",
    z.object({
      monthly: z.boolean(),
      plan: z.enum(PAID_PLANS),
    }),
  ), async (c) => {
    const { profile } = await getAuthenticatedUser(c);
    const { monthly, plan } = c.req.valid("json");

    const product = await getProductByKey(plan);
    if (!product || !profile) throw new Error("Invalid plan");

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: product.priceId, quantity: 1 },
    ];

    // Optional router
    if (plan === "premium" && !profile.purchasedRouter) {
      const router = await getProductByKey("router");
      if (router) {
        line_items.push({ price: router.priceId, quantity: 1 });
      }
    }

    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      custom_fields: [{
        dropdown: {
          default_value: monthly ? "yes" : "no",
          options: [
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ],
        },
        key: "auto_renew",
        label: {
          custom: "Auto-renewal",
          type: "custom",
        },
        type: "dropdown",
      }],
      customer: profile.stripeCustomerId || "",
      line_items,
      mode: "subscription",
      success_url: `${SITE_URL}/dashboard`,
    });

    return c.json({ url: session.url });
  })

  .post("/add-data", async (c) => {
    const { profile } = await getAuthenticatedUser(c);
    if (!profile?.subscriptionId) throw new Error("No active subscription");

    const currentPlan = profile.subscriptionType;
    const GBPerDollar = PLAN_LIMITS[currentPlan].data / PLAN_LIMITS[currentPlan].price;
    const packageData = DATA_PACKAGE_PRICE * GBPerDollar;

    const session = await stripe.checkout.sessions.create({
      customer: profile.stripeCustomerId || "",
      invoice_creation: {
        enabled: true,
      },
      line_items: [{
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
        },
        price_data: {
          currency: "usd",
          product_data: {
            description: `
            This data will ONLY be added to your current monthly cycle, so only buy as much as you need.`,
            name: `Extra data package (${packageData}GB)`,
          },
          unit_amount: DATA_PACKAGE_PRICE * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${SITE_URL}/dashboard`,
    });

    return c.json({ url: session.url });
  })

  .post("/buy-router", async (c) => {
    const { profile } = await getAuthenticatedUser(c);

    const product = await getProductByKey("router");
    if (!product || !profile) throw new Error("Router missing");

    const session = await stripe.checkout.sessions.create({
      customer: profile.stripeCustomerId || "",
      invoice_creation: {
        enabled: true,
      },
      line_items: [{ price: product.priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${SITE_URL}/dashboard`,
    });

    return c.json({ url: session.url });
  })

  .post("/customer-portal", zValidator(
    "json",
    z.object({
      plan: z.enum(PAID_PLANS).optional(),
    }).optional(),
  ), async (c) => {
    const { profile } = await getAuthenticatedUser(c);
    if (!profile) throw new Error("Profile missing");

    const body = c.req.valid("json");
    const plan = body?.plan;
    const product = await getProductByKey(plan);

    const stripeCustomerId = profile.stripeCustomerId ?? "";
    const subscriptionId = profile.subscriptionId;
    const itemId = profile.subscriptionItemId;
    const config: Stripe.BillingPortal.SessionCreateParams = plan && product && subscriptionId && itemId
      ? {
          customer: stripeCustomerId,
          flow_data: {
            subscription_update_confirm: {
              items: [{ id: itemId, price: product.priceId }],
              subscription: subscriptionId,
            },
            type: "subscription_update_confirm",
          },
          return_url: `${SITE_URL}/dashboard`,
        }
      : {
          customer: stripeCustomerId,
          return_url: `${SITE_URL}/dashboard/account`,
        };
    const portal = await stripe.billingPortal.sessions.create(config);

    return c.json({ url: portal.url });
  })

  .post("/renew-plan", zValidator(
    "json",
    z.object({
      renew: z.boolean(),
    }),
  ), async (c) => {
    const { profile } = await getAuthenticatedUser(c);
    if (!profile) throw new Error("Profile missing");

    const { renew } = c.req.valid("json");

    const subscriptionId = profile.subscriptionId;
    const subscriptionType = profile.subscriptionType;
    if (!subscriptionId || FREE_PLANS.includes(subscriptionType as any)) {
      throw new Error("Not a valid subscription");
    }
    await setSubscriptionRenew(subscriptionId, renew);

    return c.json({ message: "Successfully updated subscription" }, 200);
  })

  .post("/webhook", async (c) => {
    const signature = c.req.raw.headers.get("stripe-signature");
    if (!signature) return c.json({ message: "Missing headers" }, 400);

    const body = await c.req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET || "",
    );

    let processed = true;
    switch (event.type) {
      case "invoice.paid":{
        const invoice = event.data.object;

        const reason = invoice.billing_reason;
        const stripeCustomerId = invoice.customer as string;
        const profile = await getProfileByStripeId(stripeCustomerId);
        if (!profile) throw new Error(`Customer missing for ${stripeCustomerId}`);

        if (reason === "manual" || reason === "subscription_create") {
          await handleItemPurchases(stripeCustomerId, invoice, c.var.logger);
        } else if (reason === "subscription_cycle") {
          await resetUsageLimit(profile.hiddifyId, profile.hiddifyServerId, profile.subscriptionType, c.var.logger);
        }
        break;
      }

      case "checkout.session.completed":{
        const session = event.data.object;

        const subscriptionId = session.subscription as string;
        const stripeCustomerId = session.customer as string;
        const isNewSubscription = session.custom_fields?.find(field => field.key = "auto_renew");
        const isAutoRenew = isNewSubscription?.dropdown?.value === "yes";

        if (session.status === "complete") {
          if (subscriptionId && isNewSubscription) {
            await setSubscriptionRenew(subscriptionId, isAutoRenew);
            c.var.logger.debug(`Set subscription to auto-renew:${isAutoRenew} for ${stripeCustomerId}`);
          }
        }
        break;
      }
      case "customer.updated": {
        const customer = event.data.object;

        const stripeCustomerId = customer.id;
        const profile = await getProfileByStripeId(stripeCustomerId);
        if (!profile) throw new Error(`Customer update failed for ${stripeCustomerId}`);

        await updateUser(profile.userId, customer.name || "");
        c.var.logger.debug(`Customer updated for ${stripeCustomerId}`);
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object;

        await updateSubscription(subscription);
        c.var.logger.debug(`Subscription updated for ${subscription.customer}`);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        await cancelSubscription(subscription);
        c.var.logger.debug(`Subscription cancelled for ${subscription.customer}`);
        break;
      }
      case "product.created":
      case "product.updated": {
        const product = event.data.object;

        await updateProduct(product);
        c.var.logger.debug(`${product.name} synced to DB`);
        break;
      }
      default:
        processed = false;
        c.var.logger.error(`Receive webhook event:${event.type} but failed to process!`);
        break;
    }
    return c.json({ message: processed ? "Successfully processed" : "Failed to process" }, 200);
  });

export default route;
