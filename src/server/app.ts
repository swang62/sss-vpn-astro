import type { PinoLogger } from "hono-pino";

import { Hono } from "hono";

import type { Session, UserSession } from "@/lib/auth-clients";

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
    userSession: UserSession;
    session: Session;
  };
}

export function createBaseRouter() {
  return new Hono<Bindings>({ strict: false });
}

export default function createApp() {
  const app = createBaseRouter()
    .basePath("/api");

  app.use(authMiddleware);
  app.use(pinoLogger());
  app.use(corsMiddleware());
  app.use(limiter());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
