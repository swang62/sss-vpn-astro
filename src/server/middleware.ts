import type { ErrorHandler, MiddlewareHandler, NotFoundHandler } from "hono";
import type { ClientResponse } from "hono/client";
import type { StatusCode } from "hono/utils/http-status";

import { logger } from "hono-pino";
import { cors } from "hono/cors";
import pino from "pino";
import pretty from "pino-pretty";

import env from "@/types";

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
    origin: ["localhost", "127.0.0.1", "::1"],
    allowMethods: ["*"],
    credentials: true,
  });
}

export const onError: ErrorHandler = (error, c) => {
  const currentStatus =
    "status" in error ? error.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== 200 ? (currentStatus as StatusCode) : 500;

  return c.json(
    {
      message: error.message || "Unknown Error",
      stack: env.isProduction ? undefined : error.stack,
    },
    statusCode
  );
};

export function pinoLogger() {
  return logger({
    pino: pino(env.isProduction ? undefined : pretty()),
    http: {
      reqId: () => crypto.randomUUID(),
      onReqBindings: (c) => ({
        req: {
          url: c.req.path,
          method: c.req.method,
          host: c.req.header("host"),
        },
      }),
    },
  });
}
