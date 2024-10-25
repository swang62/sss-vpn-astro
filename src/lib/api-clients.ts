import { hc } from "hono/client";

import type { App } from "@/server";

import { SITE_URL } from "@/config/client";

//*  Should only contain client-side calls/actions

// Hono
export const { api: apiClient } = hc<App>(SITE_URL);

// SWR
export async function fetchUser() {
  return apiClient.user.$get().then((res) => res.json());
}
export async function fetchStatus() {
  return apiClient.status.$get().then((res) => res.json());
}
