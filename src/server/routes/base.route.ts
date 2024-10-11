import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import env from "@/lib/env";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter().get(
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
      method: c.req.method,
      production: env._isProduction,
      query: c.req.valid("query"),
      status: "ok",
    });
  },
);

export default route;
