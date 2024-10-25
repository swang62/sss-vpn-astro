import postmark from "postmark";
import { RedisStore } from "rate-limit-redis";
import { createClient } from "redis";
import { Stripe } from "stripe";

import {
  POSTMARK_TOKEN,
  REDIS_PASS,
  REDIS_URL,
  STRIPE_SECRET_KEY,
} from "@/config/server";

//* Should only contain server-side clients/actions

// Stripe
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  maxNetworkRetries: 3,
  timeout: 10 * 1000,
});

// Postmark
export const postmarkClient = POSTMARK_TOKEN
  ? new postmark.ServerClient(POSTMARK_TOKEN)
  : null;

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

// eslint-disable-next-line antfu/no-top-level-await
export const redis = REDIS_URL ? await getRedisStore() : undefined;
