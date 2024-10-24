import type { PinoLogger } from "hono-pino";

import { Hono } from "hono";

import type { Session, UserSession } from "@/lib/clients";

import { auth } from "@/lib/auth";

import {
  authMiddleware,
  corsMiddleware,
  limiter,
  notFound,
  onError,
  pinoLogger,
} from "./middleware";

export interface Bindings {
  Variables: {
    logger: PinoLogger;
    user: UserSession;
    session: Session;
  };
}

export function createBaseRouter() {
  return new Hono<Bindings>({ strict: false });
}

export default function createApp() {
  const app = createBaseRouter().basePath("/api");

  app.use(authMiddleware);
  app.use("/user*", (c) => auth.handler(c.req.raw));
  // app.use("/user/*", bearerAuth({ token: API_TOKEN }));
  app.use(pinoLogger());
  app.use(corsMiddleware());
  app.use(limiter());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
