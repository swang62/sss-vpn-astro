import type { ErrorHandler, MiddlewareHandler, NotFoundHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { captureException } from "@sentry/astro";
import { logger } from "hono-pino";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import pino from "pino";
import pretty from "pino-pretty";

import { IS_PRODUCTION, IS_TESTING, LOG_LEVEL } from "@/config/server";
import { TEST_USER } from "@/db/seed";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/context";

import type { Bindings } from "./app";

export const authMiddleware = createMiddleware<Bindings>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

export const testMiddleware = createMiddleware<Bindings>(async (c, next) => {
  if (!IS_TESTING) {
    return next();
  }

  c.set("user", TEST_USER);
  c.set("session", {
    expiresAt: new Date(),
    id: TEST_USER.id,
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

  const currentStatus =
    "status" in error ? error.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== 200 ? (currentStatus as StatusCode) : 500;
  const errorMessage = {
    message: statusCode === 401 ? "Unauthorized" : error.message,
    stack: IS_PRODUCTION ? undefined : error.stack,
  };

  return c.json(errorMessage, statusCode);
};

export function corsMiddleware(): MiddlewareHandler {
  return cors({
    allowHeaders: ["*"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    exposeHeaders: ["*"],
    maxAge: 600,
    origin: (origin) =>
      origin.includes(".mildlybrewed.") || !IS_PRODUCTION
        ? origin
        : "localhost",
  });
}

export function pinoLogger(): MiddlewareHandler {
  return logger({
    http: {
      onReqBindings: (c) => {
        // const headers = c.req.header();
        // const cookies = headers.cookie;
        // delete headers.cookie;
        return {
          request: {
            // cookies: LOG_LEVEL === "debug" ? cookies : undefined,
            // headers,
            method: c.req.method,
            url: c.req.path,
          },
        };
      },
      onResBindings: (c) => ({
        status: c.res.status,
      }),
      reqId: false,
    },
    pino: pino({ level: LOG_LEVEL }, IS_PRODUCTION ? undefined : pretty()),
  });
}

export function limiter(): MiddlewareHandler {
  return rateLimiter({
    keyGenerator: (c) =>
      `${c.req.path}-${c.req.header("cf-connecting-ip") ?? ""}`,
    limit: (c) => (c.req.header("host")?.includes("localhost") ? 1000 : 50),
    message: {
      message: "Too many requests, try again later.",
    },
    standardHeaders: "draft-6",
    // @ts-expect-error if undefined, automatically use in-memory storage.
    store: redis?.store,
    windowMs: 10 * 1000,
  });
}
