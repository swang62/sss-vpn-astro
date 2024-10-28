import { auth } from "@/lib/auth";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter()
  .get("/*", c => auth.handler(c.req.raw))
  .post("/*", c => auth.handler(c.req.raw));

export default route;
