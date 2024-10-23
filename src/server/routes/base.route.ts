import { zValidator } from "@hono/zod-validator";
import { captureException } from "@sentry/astro";
import { z } from "zod";

import { IS_PRODUCTION } from "@/config/server";
import { getUserByEmail, getUserByToken } from "@/db/queries";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter()
  .get("/status", (c) => {
    const response: any = {};
    c.res.headers.forEach((value, key) => {
      response[key] = value;
    });

    return c.json({
      _requested_at: new Date(),
      endpoint: c.req.path,
      production: IS_PRODUCTION,
      request: c.req.header(),
      response,
    });
  })
  .get(
    "/search-email",
    zValidator(
      "query",
      z.object({
        email: z.string(),
      }),
    ),
    async (c) => {
      const { email } = c.req.valid("query");

      const user = await getUserByEmail(email);
      if (!user || !email) {
        return c.json({ exists: false });
      }

      return c.json({ exists: true });
    },
  )
  .get(
    "/search-token",
    zValidator(
      "query",
      z.object({
        token: z.string().optional(),
      }),
    ),
    async (c) => {
      const { token } = c.req.valid("query");

      const user = await getUserByToken(token);
      if (!user) {
        return c.json({ email: null });
      }

      return c.json({ email: user.email });
    },
  )
  .get("/error", (c) => {
    const message = "Fake api error";
    captureException(new Error(message));
    return c.json({ message }, 500);
  });

export default route;
