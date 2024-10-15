import { hc } from "hono/client";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";

import type { App } from "@/server";

import { API_SERVER_URL, API_TOKEN, REDIS_URL } from "@/config/server";

// API client
export const { api: apiServer } = hc<App>(API_SERVER_URL, {
  headers: { Authorization: `Bearer ${API_TOKEN}` },
});

async function getRedisStore() {
  if (!REDIS_URL) return;

  console.debug("Connecting to redis -", REDIS_URL);

  const client = await createClient({ url: `redis://${REDIS_URL}` })
    .on("error", (error) => console.error("Failed to connect to redis", error))
    .connect();

  return new RedisStore({
    sendCommand: async (...args: string[]) => client.sendCommand(args),
  });
}

// Redis client
// eslint-disable-next-line antfu/no-top-level-await
export const redisStore = REDIS_URL ? await getRedisStore() : undefined;
