import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import { IS_PRODUCTION } from "@/env/server";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter()
  .get(
    "/status",
    zValidator(
      "query",
      z
        .object({
          id: z.string().optional(),
        })
        .optional(),
    ),
    (c) => {
      return c.json({
        endpoint: c.req.path,
        headers: c.req.header(),
        method: c.req.method,
        production: IS_PRODUCTION,
        query: c.req.valid("query"),
        status: "ok",
      });
    },
  )
  .get("/error", (c) => {
    return c.json({ message: "Fake api error" }, 500);
  });

export default route;
