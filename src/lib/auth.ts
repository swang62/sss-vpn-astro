import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "@/db";
import { redis } from "@/server/backend";

const client = redis ? redis.client : null;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    minPasswordLength: 8,
  },
  emailVerification: {
    sendVerificationEmail: async (user, url) => {
      console.debug("VERIFY_URL", url);
      // await sendEmail({
      //   to: user.email,
      //   subject: "SSSVPN | Verify your email address",
      //   text: `Click <a href="${url}">here</a> to verify your email.`,
      // });
    },
  },
  rateLimit: {
    enabled: true,
  },
  secondaryStorage: client
    ? {
        delete: async (key) => client.del(key).toString(),
        get: async (key) => client.get(key),
        set: async (key, value, ttl) => {
          if (ttl) client.set(key, value, { EX: ttl });
          else client.set(key, value);
        },
      }
    : undefined,
});
