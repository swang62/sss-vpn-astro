import { Hono } from "hono";

import type { Bindings } from "@/lib/types";

import { corsHandler, notFound, onError, pinoLogger, serveFavicon } from "./middleware";

export function createBaseRouter() {
  return new Hono<Bindings>({ strict: false });
}

export default function createApp() {
  const app = createBaseRouter().basePath("/api");

  app.use(serveFavicon("😝"));
  app.use(pinoLogger());
  app.use(corsHandler());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
