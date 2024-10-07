import { Hono } from "hono";

import type { Bindings } from "@/types";

import env from "@/types";

const route = new Hono<Bindings>().get("/status", async (c) => {
  const query = c.req.query();

  return c.json({ production: env._isProduction, query, status: "ok" });
});

export default route;
