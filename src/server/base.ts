import { Hono } from "hono";

const route = new Hono().get("/status", async (c) => {
  const query = c.req.query();

  return c.json({ status: "ok", query });
});

export default route;
