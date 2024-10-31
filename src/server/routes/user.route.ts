import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { NAME_MAX_LENGTH } from "@/config/constants";
import { updateStripeName, updateUser } from "@/db/mutations-user";
import { getHiddifyUser } from "@/db/queries";
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
      name: z.string().max(NAME_MAX_LENGTH),
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
    if (!user.profile) throw new Error("Profile missing");

    const hiddify = await getHiddifyUser(user.profile.hiddifyId);

    return c.json({ hiddify, user });
  })
  // Public route is often used unauthenticated, fail silently
  .get("/session", async (c) => {
    try {
      const session = c.get("session");
      return c.json({ session });
    } catch (e) {
      const _error = e as Error;
    }

    return c.json({ session: null });
  });

export default route;
