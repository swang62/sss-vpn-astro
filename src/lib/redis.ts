import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";

import { REDIS_PASS, REDIS_URL } from "@/config/server";

// Redis
async function getRedisStore() {
  if (!REDIS_URL || !REDIS_PASS) return;

  console.debug("Connecting to redis:", REDIS_URL);

  const client = await createClient({
    password: REDIS_PASS,
    url: `redis://${REDIS_URL}`,
  })
    .on("error", error => console.error("Failed to connect to redis", error))
    .connect();

  return {
    client,
    store: new RedisStore({
      sendCommand: async (...args: string[]) => client.sendCommand(args),
    }),
  };
}

// eslint-disable-next-line antfu/no-top-level-await
export const redis = REDIS_URL ? await getRedisStore() : undefined;
