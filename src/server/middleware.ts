import type { ErrorHandler, MiddlewareHandler, NotFoundHandler } from "hono";
import type { ClientResponse } from "hono/client";
import type { StatusCode } from "hono/utils/http-status";

import { createId } from "@paralleldrive/cuid2";
import { logger } from "hono-pino";
import { cors } from "hono/cors";
import pino from "pino";
import pretty from "pino-pretty";

import env from "@/lib/env";

export async function parsedApi<T>(request: Promise<ClientResponse<T>>) {
  const response = await request;
  if (!response.ok) {
    const error = await response.text();
    return { error, status: response.status };
  }
  const data = (await response.json()) as T;
  return { data, status: response.status };
}

export const notFound: NotFoundHandler = (c) => {
  const path = c.req.path;

  return c.json({ message: `Not Found: ${path}` }, 404);
};

export function corsHandler(): MiddlewareHandler {
  return cors({
    allowMethods: ["*"],
    credentials: true,
    origin: ["localhost", "127.0.0.0/8", "172.0.0.0/8"],
  });
}

export const onError: ErrorHandler = (error, c) => {
  const currentStatus
    = "status" in error ? error.status : c.newResponse(null).status;
  const statusCode
    = currentStatus !== 200 ? (currentStatus as StatusCode) : 500;

  return c.json(
    {
      message: error.message || "Unknown Error",
      stack: env._isProduction ? undefined : error.stack,
    },
    statusCode
  );
};

export function pinoLogger(): MiddlewareHandler {
  return logger({
    http: {
      onReqBindings: c => ({
        req: {
          host: c.req.header("host"),
          method: c.req.method,
          url: c.req.path,
        },
      }),
      reqId: createId,
    },
    pino: pino({ level: env.LOG_LEVEL }, env._isProduction ? undefined : pretty()),
  });
}

export function serveFavicon(emoji: string): MiddlewareHandler {
  return async (c, next) => {
    if (c.req.path === "/favicon.ico") {
      c.header("Content-Type", "image/svg+xml");
      return c.body(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x="-0.1em" font-size="90">${emoji}</text></svg>`);
    }

    return next();
  };
}
