import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { SITE_URL } from "@/config/client";
import { SITE_EMAIL } from "@/config/constants";
import db from "@/db";
import { redis } from "@/lib/redis";
import { postmarkClient } from "@/lib/server-clients";

const client = redis ? redis.client : null;

export const auth = betterAuth({
  baseURL: SITE_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    async sendResetPassword(user, url) {
      if (!postmarkClient) {
        console.debug("Reset password link --", url);
        return;
      }

      postmarkClient.sendEmailWithTemplate({
        From: SITE_EMAIL,
        TemplateAlias: "password-reset",
        TemplateModel: {
          email: user.name || user.email,
          reset_url: url,
        },
        To: user.email,
      });
    },
  },
  emailVerification: {
    async sendVerificationEmail(user, url) {
      if (!postmarkClient) {
        console.debug("Verification link --", url);
        return;
      }

      postmarkClient.sendEmailWithTemplate({
        From: SITE_EMAIL,
        TemplateAlias: "verify",
        TemplateModel: {
          email: user.name || user.email,
          verification_url: url,
        },
        To: user.email,
      }).catch(() => console.error(`Failed to send email to ${user.email}, manual verification link --`, url));
    },
  },
  logger: {
    verboseLogging: true,
  },
  plugins: [admin()],
  rateLimit: {
    enabled: true,
  },
  secondaryStorage: client
    ? {
        delete: async key => client.del(key).toString(),
        get: async key => client.get(key),
        set: async (key, value, ttl) => {
          if (ttl) client.set(key, value, { EX: ttl });
          else client.set(key, value);
        },
      }
    : undefined,
  trustedOrigins: ["localhost", "127.0.0.1", "192.168.8.129"],
});
