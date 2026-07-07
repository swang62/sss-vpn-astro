import type { ClientRequestOptions, ClientResponse } from "hono/client";

import { hc } from "hono/client";
import { SITE_URL } from "@/config/client";
import type { App } from "@/server";

//*  Should only contain client-side calls/actions

// Hono
export const { api } = hc<App>(SITE_URL);
export type HonoClient = (
  args?: object,
  options?: ClientRequestOptions
) => Promise<ClientResponse<object>>;

export type ApiResult = {
  data: any;
  error: string | undefined;
  statusCode: number;
};

export async function parseApi(request: Promise<Response>): Promise<ApiResult> {
  const response = await request;
  const statusCode = response.status;
  if (!response.ok) {
    const error = await response.text();
    return { data: undefined, error, statusCode };
  }
  const data = await response.json();
  return { data, error: undefined, statusCode };
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
