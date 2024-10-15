import type { ErrorHandler, MiddlewareHandler, NotFoundHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { logger } from "hono-pino";
import { rateLimiter } from "hono-rate-limiter";
import { cors } from "hono/cors";
import pino from "pino";
import pretty from "pino-pretty";

import { IS_PRODUCTION, LOG_LEVEL } from "@/config/server";
import { redisStore } from "@/server/backend";

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
    stack: IS_PRODUCTION ? undefined : error.stack,
  };

  return c.json(errorMessage, statusCode);
};

export function corsMiddleware(): MiddlewareHandler {
  return cors({
    allowMethods: ["*"],
    credentials: true,
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
        const headers = c.req.header();
        const cookies = headers.cookie;
        delete headers.cookie;
        return {
          request: {
            cookies: LOG_LEVEL === "debug" ? cookies : undefined,
            headers: LOG_LEVEL === "debug" ? headers : undefined,
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

export function apiLimiter(): MiddlewareHandler {
  return rateLimiter({
    keyGenerator: (c) =>
      `${c.req.path}-${c.req.header("cf-connecting-ip") ?? ""}`,
    limit: (c) => (c.req.header("host")?.includes("localhost") ? 0 : 50),
    message: {
      message: "Too many requests, try again later.",
    },
    standardHeaders: "draft-6",
    // @ts-expect-error
    store: redisStore,
    windowMs: 10 * 1000,
  });
}
