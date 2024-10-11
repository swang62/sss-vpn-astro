import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { z } from "zod";

import db, { users } from "@/db";

import { createBaseRouter } from "./app";

const route = createBaseRouter()
  .get("/:id", zValidator("param", z.object({
    id: z.string()
  })), async (c) => {
    const { id } = c.req.valid("param");

    const profile = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: { profile: true }
    });

    if (!profile) {
      c.status(404);
      throw new Error(`User ID:${id} not found`);
    }

    return c.json({ profile });
  });

export default route;
