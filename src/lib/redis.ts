import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import { createStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import redisDriver from "unstorage/drivers/redis";

import { REDIS_PASS, REDIS_URL } from "@/config/server";

// Redis
async function getRedisStore() {
  if (!REDIS_URL || !REDIS_PASS) return;

  console.debug("Connecting to redis:", REDIS_URL);

  const client = await createClient({
    password: REDIS_PASS,
    url: `redis://${REDIS_URL}`,
  })
    .on("error", (error) => console.error("Failed to connect to redis", error))
    .connect();

  return {
    client,
    store: new RedisStore({
      sendCommand: async (...args: string[]) => client.sendCommand(args),
    }),
  };
}

export const redis = REDIS_URL ? await getRedisStore() : undefined;

export const storage = REDIS_URL
  ? createStorage<string>({
      driver: redisDriver({
        base: "unstorage",
        host: REDIS_URL,
        password: REDIS_PASS,
      }),
    })
  : createStorage<string>({
      driver: memoryDriver(),
    });
