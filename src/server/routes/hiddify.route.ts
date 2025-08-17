import { getHiddifyUserById } from "@/db/queries";
import { createBaseRouter } from "@/server/app";

import { getAuthenticatedUser } from "../middleware";

// All hiddify routes must be authenticated

const route = createBaseRouter().get("/usage", async (c) => {
  const user = await getAuthenticatedUser(c);
  if (!user.profile) {
    return c.json({ usage: null, user: null }, 404);
  }

  const usage = await getHiddifyUserById(
    user.profile.hiddifyId,
    user.profile.hiddifyServerId
  );
  if (!usage) {
    return c.json({ usage: null, user: null }, 404);
  }

  return c.json({ usage, user });
});

export default route;
