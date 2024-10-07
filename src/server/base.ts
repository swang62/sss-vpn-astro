import { Hono } from "hono";

import type { Bindings } from "@/types";

import env from "@/types";

const route = new Hono<Bindings>().get("/status", async (c) => {
  const query = c.req.query();

  return c.json({ status: "ok", query, production: env.isProduction });
});

export default route;
