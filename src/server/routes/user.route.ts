import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { z } from "zod";

import db, { user } from "@/db";
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

    const userRecord = await db.query.user.findFirst({
      where: eq(user.id, id),
      with: { account: true, profile: true, session: true },
    });

    if (!userRecord) {
      c.status(404);
      return c.json({ error: `User ${id} not found`, user: null });
    }

    return c.json({ user: userRecord });
  },
);

export default route;
