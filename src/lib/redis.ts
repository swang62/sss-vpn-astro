import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";

import { REDIS_PASS, REDIS_URL } from "@/config/server";

let _redis: { client: any; store: RedisStore } | undefined;

async function init() {
  if (!REDIS_URL || !REDIS_PASS) return;

  const client = await createClient({
    password: REDIS_PASS,
    url: `redis://${REDIS_URL}`,
  })
    .on("error", (error) => console.error("Redis error:", error))
    .connect();

  _redis = {
    client,
    store: new RedisStore({
      sendCommand: async (...args: string[]) => client.sendCommand(args),
    }),
  };
}

init().catch((e) => console.error("Redis connection failed:", e));

export function getRedis() {
  return _redis;
}
