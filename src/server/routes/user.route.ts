import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { MAX_NAME_LENGTH } from "@/config/constants";
import { updateStripeName, updateUser } from "@/db/mutations-user";
import { getHiddifyUsage, getUserRawById } from "@/db/queries";
import { stripe } from "@/lib/server-clients";
import { createBaseRouter } from "@/server/app";

import { checkAdminAccess, getAuthenticatedUser } from "../middleware";

//* All user routes must be authenticated

const route = createBaseRouter()
  .get("/", async (c) => {
    const user = await getAuthenticatedUser(c);
    const session = c.get("session");

    return c.json({ session, user });
  })
  .get("/:id", async (c) => {
    await checkAdminAccess(c);

    const userId = c.req.param("id");
    const user = await getUserRawById(userId);
    if (!user) {
      c.status(404);
      throw new Error(`UserId ${userId} not found`);
    }

    let usage = null;
    let customer = null;
    if (user.profile?.hiddifyId) {
      usage = await getHiddifyUsage(user.profile.hiddifyId, user.profile.hiddifyServerId);
    }
    if (user.profile?.stripeCustomerId) {
      customer = await stripe.customers.retrieve(user.profile.stripeCustomerId);
    }

    return c.json({ _user: user, hiddify: usage, stripe: customer });
  })
  .patch("/", zValidator(
    "json",
    z.object({
      name: z.string().max(MAX_NAME_LENGTH),
    }),
  ), async (c) => {
    const user = await getAuthenticatedUser(c);
    const { name } = c.req.valid("json");
    const stripeCustomerId = user.profile?.stripeCustomerId;

    const updatedUser = await updateUser(user.id, name);
    if (stripeCustomerId) await updateStripeName(stripeCustomerId, name);

    return c.json({ user: updatedUser });
  });

export default route;
