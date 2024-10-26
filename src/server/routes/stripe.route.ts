import { SITE_URL } from "@/config/client";
import { STRIPE_WEBHOOK_SECRET } from "@/config/server";
import { updateProduct } from "@/db/mutations-product";
import { stripe } from "@/lib/context";
import { authUser, createBaseRouter } from "@/server/app";

// All /api/stripe routes must be authenticated

const route = createBaseRouter()
  .post("/customer-portal", async (c) => {
    const user = await authUser(c);

    const stripeCustomerId = user.profile?.stripeCustomerId ?? "";
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${SITE_URL}/dashboard/account`,
    });

    return c.json({ url: session.url });
  })
  .post("/webhook", async (c) => {
    // const user = await authUser(c);
    const signature = c.req.raw.headers.get("stripe-signature");

    if (!signature) return c.text("", 400);
    const body = await c.req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET,
    );
    switch (event.type) {
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const _customerId = subscription.customer as string;

        c.var.logger.debug(subscription);
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
    return c.text("", 200);
  });

export default route;
