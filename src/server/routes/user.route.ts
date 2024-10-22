import { getUserFromDB } from "@/db/queries";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter()
  .get("/", async (c) => {
    const user = c.get("user");
    if (!user) {
      c.status(401);
      throw new Error(`Not allowed`);
    }
    const id = user.id;

    const userRecord = await getUserFromDB(id);
    if (!userRecord) {
      c.status(404);
      throw new Error(`User ${id} not found`);
    }

    return c.json({ user: userRecord });
  })
  .get("/session", async (c) => {
    const session = c.get("session");
    const user = c.get("user");
    if (!user) {
      c.status(401);
      throw new Error(`Not allowed`);
    }

    return c.json({ session, user });
  });

export default route;
