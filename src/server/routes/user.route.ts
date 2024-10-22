import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { z } from "zod";

import db, { profile, user } from "@/db";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter()
  .get(
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
        columns: {
          createdAt: false,
          updatedAt: false,
        },
        where: eq(user.id, id),
        with: {
          profile: {
            columns: {
              createdAt: false,
              updatedAt: false,
            },
          },
        },
      });

      if (!userRecord) {
        c.status(404);
        throw new Error(`User ${id} not found`);
      }

      return c.json({ user: userRecord });
    },
  )
  .post(
    "/setupProfile",
    zValidator(
      "json",
      z.object({
        id: z.string(),
      }),
    ),
    async (c) => {
      const { id } = c.req.valid("json");

      await db
        .insert(profile)
        .values([{ subscription: "trial", userId: id }])
        .onConflictDoNothing();

      return c.json({ message: `Created profile for ${id}` });
    },
  );

export default route;
