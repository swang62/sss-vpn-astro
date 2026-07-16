import { createClient } from "redis";

import { REDIS_PASS, REDIS_URL } from "@/config/server";

// Top-level await intentional — Redis is a hard requirement
// when REDIS_URL is set. Do NOT make this fire-and-forget or lazy loaded
const client = REDIS_URL
  ? await createClient({
      password: REDIS_PASS,
      url: `redis://${REDIS_URL}`,
    })
      .on("error", (error) => console.error("Redis error:", error))
      .connect()
  : undefined;

if (client) {
  console.log("Redis connected");
} else {
  console.log("Redis not configured — using in-memory store");
}

export const redis = client;
