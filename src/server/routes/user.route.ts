import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { MAX_NAME_LENGTH } from "@/config/constants";
import { updateStripeName, updateUser } from "@/db/mutations-user";
import { getHiddifyUsage } from "@/db/queries";
import { authUser, createBaseRouter } from "@/server/app";

// All user routes must be authenticated

const route = createBaseRouter()
  .get("/", async (c) => {
    const user = await authUser(c);
    const session = c.get("session");

    return c.json({ session, user });
  })
  .post("/", zValidator(
    "json",
    z.object({
      name: z.string().max(MAX_NAME_LENGTH),
    }),
  ), async (c) => {
    const user = await authUser(c);
    const { name } = c.req.valid("json");
    const stripeCustomerId = user.profile?.stripeCustomerId;

    const updatedUser = await updateUser(user.id, name);
    if (stripeCustomerId) await updateStripeName(stripeCustomerId, name);

    return c.json({ user: updatedUser });
  })
  .get("/usage", async (c) => {
    const user = await authUser(c);
    if (!user.profile) {
      return c.json({ usage: null, user: null }, 404);
    };

    const usage = await getHiddifyUsage(user.profile.hiddifyId, user.profile.hiddifyServerId);

    return c.json({ usage, user });
  })
  .get("/session", async (c) => {
    const session = c.get("session");
    return c.json({ session });
  });

export default route;
