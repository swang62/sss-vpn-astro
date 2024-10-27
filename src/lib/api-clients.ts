import { type ClientResponse, hc } from "hono/client";

import type { App } from "@/server";

import { SITE_URL } from "@/config/client";

//*  Should only contain client-side calls/actions

// Hono
export const { api: apiClient } = hc<App>(SITE_URL);

export async function parseApi<T>(request: Promise<ClientResponse<T>>) {
  const response = await request;
  if (!response.ok) {
    const error = await response.text();
    return { error, status: response.status };
  }
  const data = (await response.json()) as T;
  return { data, status: response.status };
}

// SWR
export async function fetchUser() {
  return apiClient.user.$get().then(res => res.json());
}
export type User = Awaited<ReturnType<typeof fetchUser>>["user"];

export async function fetchStatus() {
  return apiClient.status.$get().then(res => res.json());
}
