import type { PinoLogger } from "hono-pino";

import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";

import { API_TOKEN } from "@/config/server";

import {
  corsMiddleware,
  customMiddleware,
  limiter,
  notFound,
  onError,
  pinoLogger,
} from "./middleware";

export interface Bindings {
  Variables: {
    logger: PinoLogger;
    customClient: () => void;
  };
}

export function createBaseRouter() {
  return new Hono<Bindings>({ strict: false });
}

export default function createApp() {
  const app = createBaseRouter().basePath("/api");

  app.use("/user/*", bearerAuth({ token: API_TOKEN }));
  app.use(customMiddleware);
  app.use(pinoLogger());
  app.use(corsMiddleware());
  app.use(limiter());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
