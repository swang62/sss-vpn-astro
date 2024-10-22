import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import db from "@/db";
import { postmarkClient, redis } from "@/lib/backend";

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
      if (!postmarkClient) {
        console.debug("VERIFY_URL", url);
        return;
      }

      postmarkClient.sendEmailWithTemplate({
        From: "hello@sss-vpn.com",
        TemplateAlias: "verify",
        TemplateModel: {
          email: user.email,
          verification_url: url,
        },
        To: user.email,
      });
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
