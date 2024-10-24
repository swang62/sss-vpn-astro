import { zValidator } from "@hono/zod-validator";
import { captureException } from "@sentry/astro";
import { z } from "zod";

import { IS_PRODUCTION } from "@/config/server";
import { getUserByEmail } from "@/db/queries";
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
  .get("/error", (c) => {
    const message = "Fake api error";
    captureException(new Error(message));
    return c.json({ message }, 500);
  });

export default route;
