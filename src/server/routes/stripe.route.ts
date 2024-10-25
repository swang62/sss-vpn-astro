import { SITE_URL } from "@/config/client";
import { getUserById } from "@/db/queries";
import { stripe } from "@/lib/context";
import { createBaseRouter } from "@/server/app";

// All /api/stripe routes must be authenticated

const route = createBaseRouter().post("/customer-portal", async (c) => {
  const user = c.get("user");
  if (!user) {
    c.status(401);
    throw new Error(`Not allowed!`);
  }

  const id = user.id;
  const userRecord = await getUserById(id);
  if (!userRecord || !userRecord.profile?.stripeCustomerId) {
    c.status(404);
    throw new Error(`Strip user ${id} not found`);
  }

  const stripeCustomerId = userRecord.profile.stripeCustomerId;
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${SITE_URL}/dashboard/account`,
  });

  return c.json({ url: session.url });
});

export default route;
