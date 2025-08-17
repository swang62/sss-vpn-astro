import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { SITE_URL } from "@/config/client";
import { SITE_EMAIL } from "@/config/constants";
import { LOG_LEVEL } from "@/config/server";
import db from "@/db";
import { redis } from "@/lib/redis";
import { postmarkClient } from "@/lib/server-clients";

const client = redis ? redis.client : null;
const level = LOG_LEVEL === "silent" ? undefined : LOG_LEVEL;

export const auth = betterAuth({
  baseURL: SITE_URL,
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    sendResetPassword: async ({ url, user }) => {
      if (!postmarkClient) {
        console.debug("RESET PASSWORD --", url);
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
    autoSignInAfterVerification: true,
    sendOnSignUp: false,
    sendVerificationEmail: async ({ url, user }) => {
      if (url.endsWith("callbackURL=/")) {
        return;
      } else if (!postmarkClient) {
        console.debug("VERIFICATION --", url);
        return;
      }

      postmarkClient
        .sendEmailWithTemplate({
          From: SITE_EMAIL,
          TemplateAlias: "verify",
          TemplateModel: {
            email: user.name || user.email,
            verification_url: url,
          },
          To: user.email,
        })
        .catch(() =>
          console.error(`Failed to send email to ${user.email}, link:`, url)
        );
    },
  },
  logger: { level },
  plugins: [admin()],
  rateLimit: { enabled: true },
  secondaryStorage: client
    ? {
        delete: async (key) => client.del(key).toString(),
        get: async (key) => client.get(key),
        set: async (key, value, ttl) => {
          if (ttl)
            client.set(key, value, { expiration: { type: "EX", value: ttl } });
          else client.set(key, value);
        },
      }
    : undefined,
  session: { storeSessionInDatabase: true },
  telemetry: { enabled: false },
  trustedOrigins: ["localhost", "127.0.0.1", "192.168.8.129"],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
});
