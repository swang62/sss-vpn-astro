import { getHiddifyUser } from "@/db/queries";
import { authUser, createBaseRouter } from "@/server/app";

// All user routes must be authenticated

const route = createBaseRouter()
  .get("/", async (c) => {
    const user = await authUser(c);
    const session = c.get("session");

    return c.json({ session, user });
  })
  .get("/usage", async (c) => {
    const user = await authUser(c);
    if (!user.profile) throw new Error("Profile missing");

    const hiddify = await getHiddifyUser(user.profile.hiddifyId);

    return c.json({ hiddify, user });
  });

export default route;
