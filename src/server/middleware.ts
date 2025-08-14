import type { Context, ErrorHandler, MiddlewareHandler, NotFoundHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

import { captureException } from "@sentry/astro";
import { pinoLogger as logger } from "hono-pino";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import pino from "pino";
import pretty from "pino-pretty";

import { IS_PRODUCTION, IS_TESTING, LOG_LEVEL } from "@/config/server";
import { getUserById } from "@/db/queries";
import { TEST_USER } from "@/db/seed";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";

import type { Bindings } from "./app";

// Psuedo-middleware (needed for all auth routes)
// Get the actual user record from the DB
export async function getAuthenticatedUser(c: Context<Bindings>) {
  const userSession = c.get("userSession");
  if (!userSession) {
    c.status(401);
    throw new Error(`Unauthorized`);
  }

  const id = userSession.id;
  const user = await getUserById(id);
  if (!user) {
    c.status(404);
    throw new Error(`User ${id} not found`);
  }

  return user;
};

// Add better-auth user/session tokens to Hono context
export const authMiddleware = createMiddleware<Bindings>(async (c, next) => {
  if (IS_TESTING) {
    return next();
  }

  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("userSession", null);
    c.set("session", null);
    return next();
  }

  c.set("userSession", session.user);
  c.set("session", session.session);
  return next();
});

export const testMiddleware = createMiddleware<Bindings>(async (c, next) => {
  if (!IS_TESTING) {
    return next();
  }

  const now = new Date();

  c.set("userSession", TEST_USER);
  c.set("session", {
    createdAt: now,
    expiresAt: now,
    id: TEST_USER.id,
    token: "",
    updatedAt: now,
    userId: TEST_USER.id,
  });
  return next();
});

export const notFound: NotFoundHandler = (c) => {
  const path = c.req.path;

  return c.json({ message: `Invalid path: ${path}` }, 404);
};

export const onError: ErrorHandler = (error, c) => {
  captureException(error);

  const currentStatus
    = "status" in error ? error.status : c.newResponse(null).status;
  const statusCode
    = currentStatus !== 200 ? (currentStatus as ContentfulStatusCode) : 500;
  const errorMessage = {
    message: statusCode === 401 ? "Unauthorized" : error.message,
    stack: IS_PRODUCTION ? undefined : error.stack,
  };

  return c.json(errorMessage, statusCode);
};

export function corsMiddleware(): MiddlewareHandler {
  return !IS_PRODUCTION
    ? createMiddleware((_c, next) => next())
    : cors({
        allowHeaders: ["*"],
        allowMethods: ["GET", "POST", "OPTIONS"],
        credentials: true,
        exposeHeaders: ["*"],
        maxAge: 600,
        origin: origin =>
          origin.includes(".mildlybrewed.")
            ? origin
            : "localhost",
      });
}

export function pinoLogger(): MiddlewareHandler {
  return logger({
    http: {
      onReqBindings: (c) => {
        // const headers = c.req.header();
        return {
          request: {
            // headers: LOG_LEVEL === "debug" ? headers : undefined,
            method: c.req.method,
            url: c.req.path,
          },
        };
      },
      onResBindings: c => ({
        status: c.res.status,
      }),
      reqId: false,
    },
    pino: pino({ level: LOG_LEVEL }, IS_PRODUCTION ? undefined : pretty()),
  });
}

export function limiter(): MiddlewareHandler {
  return rateLimiter({
    keyGenerator: c =>
      `${c.req.path}-${c.req.header("cf-connecting-ip") ?? ""}`,
    limit: c => (c.req.header("host")?.includes("localhost") ? 1000 : 50),
    message: {
      message: "Too many requests, try again later.",
    },
    standardHeaders: "draft-6",
    // @ts-expect-error if undefined, automatically use in-memory storage.
    store: redis?.store,
    windowMs: 10 * 1000,
  });
}
