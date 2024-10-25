import { getUserById } from "@/db/queries";
import { createBaseRouter } from "@/server/app";

// All /api/user routes must be authenticated

const route = createBaseRouter().get("/", async (c) => {
  const user = c.get("user");
  if (!user) {
    c.status(401);
    throw new Error(`User not found`);
  }
  const id = user.id;

  const userRecord = await getUserById(id);
  if (!userRecord) {
    c.status(404);
    throw new Error(`User ${id} not found`);
  }

  const session = c.get("session");
  return c.json({ session, user: userRecord });
});

export default route;
