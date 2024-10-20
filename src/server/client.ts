import type { InferResponseType } from "hono/client";

import { hc } from "hono/client";

import type { App } from "@/server";

import { API_CLIENT_URL } from "@/config/client";

export const { api: apiClient } = hc<App>(API_CLIENT_URL);

// Response types
const _$get = apiClient.user[":id"].$get;
export type GetUserResponse = InferResponseType<typeof _$get>;
