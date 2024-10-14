import { IS_PRODUCTION } from "@/config/server";
import { createBaseRouter } from "@/server/app";

const route = createBaseRouter()
  .get("/status", (c) => {
    const response_headers: any = {};
    c.res.headers.forEach((value, key) => {
      response_headers[key] = value;
    });
    return c.json({
      endpoint: c.req.path,
      production: IS_PRODUCTION,
      request_headers: c.req.header(),
      response_headers,
      status: "ok",
    });
  })
  .get("/error", (c) => {
    return c.json({ message: "Fake api error" }, 500);
  });

export default route;
