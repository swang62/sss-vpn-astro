import type { PinoLogger } from "hono-pino";

import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";

import { API_TOKEN } from "@/config/server";

import {
  apiLimiter,
  corsMiddleware,
  notFound,
  onError,
  pinoLogger,
} from "./middleware";

export interface Bindings {
  Variables: {
    logger: PinoLogger;
  };
}

export function createBaseRouter() {
  return new Hono<Bindings>({ strict: false });
}

export default function createApp() {
  const app = createBaseRouter().basePath("/api");

  app.use("/user/*", bearerAuth({ token: API_TOKEN }));
  app.use(pinoLogger());
  app.use(corsMiddleware());
  app.use(apiLimiter());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
