import Redis from "ioredis";

import { REDIS_PASS, REDIS_URL } from "@/config/server";

const client = REDIS_URL
  ? new Redis({
      host: REDIS_URL,
      password: REDIS_PASS,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    })
  : undefined;

if (client) {
  console.log("Redis connected");
} else {
  console.log("Redis not configured — using in-memory store");
}

export const redis = client;
