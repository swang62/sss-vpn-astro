import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

import type { Bindings } from "@/lib/types";

import env from "@/lib/env";

const route = new Hono<Bindings>({ strict: false })
  .get("/status", zValidator(
    "query",
    z.object({
      id: z.string().optional()
    }).optional()
  ), async (c) => {
    return c.json({
      endpoint: c.req.path,
      method: c.req.method,
      production: env._isProduction,
      query: c.req.query(),
      status: "ok"
    });
  });

export default route;
