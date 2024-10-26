import { authUser, createBaseRouter } from "@/server/app";

const route = createBaseRouter()
  .get("/", async (c) => {
    const user = await authUser(c);
    const session = c.get("session");

    return c.json({ session, user });
  });

export default route;
