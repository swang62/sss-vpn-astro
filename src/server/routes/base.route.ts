import { captureException } from "@sentry/astro";

import { IS_PRODUCTION } from "@/config/server";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter()
  .get("/status", (c) => {
    const response: any = {};
    c.res.headers.forEach((value, key) => {
      response[key] = value;
    });
    return c.json({
      endpoint: c.req.path,
      production: IS_PRODUCTION,
      request: c.req.header(),
      response,
      status: "ok",
    });
  })
  .get("/error", (c) => {
    const message = "Fake api error";
    captureException(new Error(message));
    return c.json({ message }, 500);
  });

export default route;
