import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

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
    async sendResetPassword(user, url) {
      if (!postmarkClient) {
        console.debug("RESET_PASSWORD", url);
        return;
      }

      postmarkClient.sendEmailWithTemplate({
        From: "hello@sss-vpn.com",
        TemplateAlias: "password-reset",
        TemplateModel: {
          email: user.email,
          reset_url: url,
        },
        To: user.email,
      });
    },
  },
  emailVerification: {
    async sendVerificationEmail(user, url) {
      if (!postmarkClient) {
        console.debug("EMAIL_VERIFICATION", url);
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
  logger: {
    verboseLogging: true,
  },
  plugins: [admin()],
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
  trustedOrigins: ["localhost", "127.0.0.1"],
});
