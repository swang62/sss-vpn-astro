import type { ErrorHandler, MiddlewareHandler, NotFoundHandler } from "hono";
import type { StatusCode } from "hono/utils/http-status";

import { createId } from "@paralleldrive/cuid2";
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

  return c.json(
    {
      message: statusCode === 401 ? "Unauthorized" : error.message,
      stack: env._isProduction ? undefined : error.stack,
    },
    statusCode,
  );
};

export function corsMiddleware(): MiddlewareHandler {
  return cors({
    allowMethods: ["*"],
    credentials: true,
    origin: ["localhost", "127.0.0.0/8", "172.0.0.0/8"],
  });
}

export function pinoLogger(): MiddlewareHandler {
  return logger({
    http: {
      onReqBindings: (c) => ({
        req: {
          host: env.LOG_LEVEL === "debug" ? c.req.header() : undefined,
          method: c.req.method,
          url: c.req.path,
        },
      }),
      reqId: createId,
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
    standardHeaders: "draft-6",
    windowMs: 10 * 1000, // 10s
  });
}
