import type { ClientResponse } from "hono/client";

export async function parsedApi<T>(request: Promise<ClientResponse<T>>) {
  const response = await request;
  if (!response.ok) {
    const error = await response.text();
    return { error, status: response.status };
  }
  const data = (await response.json()) as T;
  return { data, status: response.status };
}
