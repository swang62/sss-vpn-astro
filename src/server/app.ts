import type { Context } from "hono";
import type { PinoLogger } from "hono-pino";

import { Hono } from "hono";

import type { Session, UserSession } from "@/lib/auth-client";

import { getUserById } from "@/db/queries";

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

export async function authUser(c: Context<Bindings>) {
  const user = c.get("user");
  if (!user) {
    c.status(401);
    throw new Error(`User not found`);
  }

  const id = user.id;
  const userRecord = await getUserById(id);
  if (!userRecord) {
    c.status(404);
    throw new Error(`User ${id} not found`);
  }

  return userRecord;
};

export function createBaseRouter() {
  return new Hono<Bindings>({ strict: false });
}

export default function createApp() {
  const app = createBaseRouter().basePath("/api");

  app.use(authMiddleware);
  app.use(pinoLogger());
  app.use(corsMiddleware());
  app.use(limiter());
  app.notFound(notFound);
  app.onError(onError);

  return app;
}
