import type Stripe from "stripe";

import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { SITE_URL } from "@/config/client";
import { STRIPE_WEBHOOK_SECRET } from "@/config/server";
import { FREE_PLANS, SUBSCRIPTION_PLANS } from "@/config/types";
import { updateProduct } from "@/db/mutations-product";
import { setSubscriptionRenew, updateProfileSubscription } from "@/db/mutations-subscription";
import { getProductByKey } from "@/db/queries";
import { stripe } from "@/lib/context";
import { authUser, createBaseRouter } from "@/server/app";

// All /api/stripe routes must be authenticated

const route = createBaseRouter()
  .post("/checkout", zValidator(
    "json",
    z.object({
      monthly: z.boolean(),
      plan: z.enum(SUBSCRIPTION_PLANS),
    }),
  ), async (c) => {
    const { profile } = await authUser(c);
    const { monthly, plan } = c.req.valid("json");

    const product = await getProductByKey(plan);
    if (!product) throw new Error("Invalid plan");

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      { price: product.priceId, quantity: 1 },
    ];

    // Optional router
    if (plan === "premium" && !profile?.purchasedRouter) {
      const router = await getProductByKey("router");
      if (router) {
        line_items.push({ price: router.priceId, quantity: 1 });
      }
    }

    const session = await stripe.checkout.sessions.create({
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
          custom: "Auto-Renewal",
          type: "custom",
        },
        type: "dropdown",
      }],
      customer: profile?.stripeCustomerId || "",
      line_items,
      mode: "subscription",
      success_url: `${SITE_URL}/dashboard`,
    });

    return c.json({ url: session.url });
  })
  .post("/customer-portal", async (c) => {
    const { profile } = await authUser(c);

    const stripeCustomerId = profile?.stripeCustomerId ?? "";
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${SITE_URL}/dashboard/account`,
    });

    return c.json({ url: session.url });
  })
  .post("/renew", zValidator(
    "json",
    z.object({
      renew: z.boolean(),
    }),
  ), async (c) => {
    const { profile } = await authUser(c);
    const { renew } = c.req.valid("json");

    const subscriptionId = profile?.subscriptionId;
    const subscriptionType = profile?.subscriptionType ?? "none";
    if (!subscriptionId || FREE_PLANS.includes(subscriptionType)) {
      throw new Error("Not a valid subscription");
    }

    await setSubscriptionRenew(subscriptionId, renew);

    return c.json({}, 200);
  })
  .post("/webhook", async (c) => {
    const signature = c.req.raw.headers.get("stripe-signature");
    if (!signature) return c.json({}, 400);

    const body = await c.req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "checkout.session.completed":{
        const session = event.data.object;
        const status = session.status;
        const isAutoRenew = session.custom_fields?.find(field => field.key = "auto_renew")?.dropdown?.value === "yes";
        const subscriptionId = session.subscription as string;
        if (status === "complete") await setSubscriptionRenew(subscriptionId, isAutoRenew);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        await updateProfileSubscription(subscription);
        break;
      }
      case "product.updated": {
        const product = event.data.object;
        await updateProduct(product);
        break;
      }
      default:
        break;
    }
    return c.json({}, 200);
  });

export default route;
