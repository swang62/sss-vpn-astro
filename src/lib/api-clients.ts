import type { ClientRequestOptions, ClientResponse } from "hono/client";

import { hc } from "hono/client";

import type { App } from "@/server";

import { SITE_URL } from "@/config/client";

//*  Should only contain client-side calls/actions

// Hono
export const { api } = hc<App>(SITE_URL);
export type HonoClient = (args?: object, options?: ClientRequestOptions) => Promise<ClientResponse<object>>;

export async function parseApi<T>(request: Promise<ClientResponse<T>>) {
  const response = await request;
  if (!response.ok) {
    const error = await response.text();
    return { error, statusCode: response.status };
  }
  const data = (await response.json()) as T;
  return { data, statusCode: response.status };
}

// React/SWR (client-side)
export async function fetchUser() {
  return api.user.$get().then(res => res.json());
}
export type User = Awaited<ReturnType<typeof fetchUser>>["user"];

export async function fetchUserFull(id: string) {
  return api.user[":id"].$get({ param: { id } }).then(res => res.json());
}
export type UserFull = Awaited<ReturnType<typeof fetchUserFull>>["_user"];

export async function fetchSession() {
  return api.session.$get().then(res => res.json());
}

export async function fetchUsage() {
  return api.hiddify.usage.$get().then((res) => {
    if (!res.ok) {
      throw new Error("Failed to get usage data");
    }
    return res.json();
  });
}
