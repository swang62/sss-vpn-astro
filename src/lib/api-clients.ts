import type { ClientRequestOptions, ClientResponse } from "hono/client";
import { hc } from "hono/client";
import type {
  ClientErrorStatusCode,
  ServerErrorStatusCode,
} from "hono/utils/http-status";
import { SITE_URL } from "@/config/client";
import type { App } from "@/server";

//*  Should only contain client-side calls/actions

// Hono
export const { api } = hc<App>(SITE_URL);
export type HonoClient = (
  args?: object,
  options?: ClientRequestOptions
) => Promise<ClientResponse<object>>;

export type ApiResult<T> =
  | { ok: true; data: T; error: undefined; statusCode: number }
  | { ok: false; data: undefined; error: string; statusCode: number };

type SuccessData<T> =
  T extends ClientResponse<
    infer D,
    infer S,
    // biome-ignore lint/suspicious/noExplicitAny: response format varies per endpoint
    any
  >
    ? S extends ClientErrorStatusCode | ServerErrorStatusCode
      ? never
      : D
    : never;

// biome-ignore lint/suspicious/noExplicitAny: generic constraint for any Hono client function
type SuccessBody<T extends (...args: any[]) => Promise<any>> = SuccessData<
  ReturnType<T> extends Promise<infer R> ? R : never
>;

// biome-ignore lint/suspicious/noExplicitAny: generic constraint for any Hono client function
export async function parseApi<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  ...[input, options]: Parameters<T>
): Promise<ApiResult<SuccessBody<T>>> {
  // biome-ignore lint/suspicious/noExplicitAny: rest-param spread unverifiable against generic callable
  const response = await (fn as any)(input, options);
  const statusCode = response.status;
  if (!response.ok) {
    const error = await response.text();
    return { ok: false, data: undefined, error, statusCode };
  }
  const data = await response.json();
  return {
    ok: true,
    data: data as SuccessBody<T>,
    error: undefined,
    statusCode,
  };
}

// React/SWR (client-side)
export async function fetchUser() {
  return api.user.$get().then((res) => res.json());
}
export type User = Awaited<ReturnType<typeof fetchUser>>["user"];

export async function fetchUserFull(id: string) {
  return api.user[":id"].$get({ param: { id } }).then((res) => res.json());
}
export type UserFull = Awaited<ReturnType<typeof fetchUserFull>>["_user"];

export async function fetchSession() {
  return api.session.$get().then((res) => res.json());
}

export async function fetchUsage() {
  return api.hiddify.usage.$get().then((res) => {
    if (!res.ok) {
      throw new Error("Failed to get usage data");
    }
    return res.json();
  });
}
