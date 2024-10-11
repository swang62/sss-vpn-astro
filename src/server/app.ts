import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";

import type { Bindings } from "@/lib/types";

import env from "@/lib/env";

import { corsMiddleware, notFound, onError, pinoLogger } from "./middleware";

export function createBaseRouter() {
  return new Hono<Bindings>({ strict: false });
}

export default function createApp() {
  const app = createBaseRouter().basePath("/api");

  app.use("/user/*", bearerAuth({ token: env.API_TOKEN }));
  app.use(pinoLogger());
  app.use(corsMiddleware());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
