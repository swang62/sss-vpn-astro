import type { ErrorHandler, MiddlewareHandler, NotFoundHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { logger } from "hono-pino";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import pino from "pino";
import pretty from "pino-pretty";

import env from "@/lib/env";

export const notFound: NotFoundHandler = (c) => {
  const path = c.req.path;

  return c.json({ message: `Invalid path: ${path}` }, 404);
};

export const onError: ErrorHandler = (error, c) => {
  const currentStatus =
    "status" in error ? error.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== 200 ? (currentStatus as StatusCode) : 500;

  const errorMessage = {
    message: statusCode === 401 ? "Unauthorized" : error.message,
    stack: env._isProduction ? undefined : error.stack,
  };
  // console.error(errorMessage); TODO: send it to sentry

  return c.json(errorMessage, statusCode);
};

export function corsMiddleware(): MiddlewareHandler {
  return cors({
    credentials: true,
    origin: (origin) =>
      origin.endsWith(".mildlybrewed.com") || !env._isProduction
        ? origin
        : "localhost",
  });
}

export function pinoLogger(): MiddlewareHandler {
  return logger({
    http: {
      onReqBindings: (c) => ({
        request: {
          headers: env.LOG_LEVEL === "debug" ? c.req.header() : undefined,
          method: c.req.method,
          url: c.req.path,
        },
      }),
      onResBindings: (c) => ({
        status: c.res.status,
      }),
      reqId: false,
    },
    pino: pino(
      { level: env.LOG_LEVEL },
      env._isProduction ? undefined : pretty(),
    ),
  });
}

export function apiLimiter(): MiddlewareHandler {
  return rateLimiter({
    keyGenerator: (c) =>
      `
      ${c.req.path || ""}
      ${c.req.header("host") || ""}
      ${c.req.header("cf-connecting-ip") || ""}
    `.trim(),
    limit: 30,
    message: {
      message: "Too many requests, try again later.",
    },
    standardHeaders: "draft-6",
    windowMs: 10 * 1000, // 10s
  });
}
