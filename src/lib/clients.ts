import { createAuthClient } from "better-auth/react";
import { hc } from "hono/client";

import type { App } from "@/server";

import { API_CLIENT_URL } from "@/config/client";

// Better auth client
export const {
  $Infer,
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  session,
  signIn,
  signOut,
  signUp,
  user,
  useSession,
  verifyEmail,
} = createAuthClient();

export type Session = typeof $Infer.Session | null;
export type UserSession = typeof $Infer.Session.user;

// Hono RPC client (no auth)
export const { api: apiClient } = hc<App>(API_CLIENT_URL);
