import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { MAX_NAME_LENGTH } from "@/config/constants";
import { deleteHiddifyUser } from "@/db/mutations-hiddify";
import { updateUser } from "@/db/mutations-user";
import { getHiddifyUserById, getUserFullById } from "@/db/queries";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/payments";
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
    const user = await getUserFullById(userId);
    if (!user) {
      c.status(404);
      throw new Error(`UserId ${userId} not found`);
    }

    let hiddify = null;
    let stripe_account = null;
    if (user.profile?.hiddifyId) {
      hiddify = await getHiddifyUserById(
        user.profile.hiddifyId,
        user.profile.hiddifyServerId
      );
    }
    if (user.profile?.stripeCustomerId) {
      stripe_account = await stripe.customers.retrieve(
        user.profile.stripeCustomerId
      );
    }

    return c.json({ _user: user, hiddify, stripe_account });
  })
  .delete("/:id", async (c) => {
    await checkAdminAccess(c);

    const userId = c.req.param("id");
    const user = await getUserFullById(userId);
    if (!user) {
      c.status(404);
      throw new Error(`UserId ${userId} not found`);
    }

    if (user.profile?.hiddifyId) {
      // delete hiddify account if exists
      await deleteHiddifyUser(
        user.profile.hiddifyId,
        user.profile.hiddifyServerId
      );
    }
    if (user.profile?.stripeCustomerId) {
      // delete stripe customer if exists
      await stripe.customers.del(user.profile.stripeCustomerId);
    }
    // Finally, delete all local traces of user
    const data = await auth.api
      .removeUser({
        body: { userId },
        headers: c.req.raw.headers,
      })
      .catch((error: Error) => {
        c.status(500);
        throw new Error(error.message);
      });

    return c.json(data);
  })
  .patch(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().max(MAX_NAME_LENGTH),
      })
    ),
    async (c) => {
      const user = await getAuthenticatedUser(c);
      const { name } = c.req.valid("json");
      const stripeCustomerId = user.profile?.stripeCustomerId;

      const updatedUser = await updateUser(user.id, name);
      if (stripeCustomerId) {
        await stripe.customers.update(stripeCustomerId, { name });
      }

      return c.json({ user: updatedUser });
    }
  );

export default route;
