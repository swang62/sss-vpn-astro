import { Hono } from "hono";

import type { Bindings } from "@/types";

import { isProduction } from "@/constants";

const route = new Hono<Bindings>().get("/status", async (c) => {
  const query = c.req.query();

  return c.json({ status: "ok", query, production: isProduction });
});

export default route;
