import { redisStorage } from "@better-auth/redis-storage";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, captcha } from "better-auth/plugins";

import { SITE_URL } from "@/config/client";
import { SITE_EMAIL } from "@/config/constants";
import { LOG_LEVEL, TURNSTILE_SECRET_KEY } from "@/config/server";
import db from "@/db";
import { getUserByEmail } from "@/db/queries";
import { postmarkClient } from "@/lib/email";
import { redis } from "@/lib/redis";

const level = LOG_LEVEL === "silent" ? undefined : LOG_LEVEL;

export const auth = betterAuth({
  baseURL: SITE_URL,
  database: drizzleAdapter(db, { provider: "sqlite" }),
  emailAndPassword: {
    autoSignIn: true,
    enabled: true,
    sendResetPassword: async ({ url, user }) => {
      const actualUser = await getUserByEmail(user.email);
      if (!actualUser) {
        throw new Error("Email does not exist.");
      }

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
  plugins: [
    admin(),
    captcha({
      endpoints: ["/sign-up/email"],
      provider: "cloudflare-turnstile",
      secretKey: TURNSTILE_SECRET_KEY,
    }),
  ],
  rateLimit: { enabled: true },
  secondaryStorage: redis
    ? redisStorage({ client: redis, keyPrefix: "better-auth:" })
    : undefined,
  session: { storeSessionInDatabase: true },
  telemetry: { enabled: false },
  trustedOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.8.129",
    "sssvpn.macsteve.lan",
  ],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
});
