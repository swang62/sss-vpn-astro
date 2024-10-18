import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { z } from "zod";

import db, { users } from "@/db";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter().get(
  "/:id",
  zValidator(
    "param",
    z.object({
      id: z.string(),
    }),
  ),
  async (c) => {
    const { id } = c.req.valid("param");

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: { profile: true },
    });

    if (!user) {
      c.status(404);
      return c.json({ error: `User ${id} not found`, user: null });
    }

    return c.json({ user });
  },
);

export default route;
