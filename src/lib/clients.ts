import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { hc } from "hono/client";
import { toast } from "sonner";

import type { App } from "@/server";

import { API_CLIENT_URL } from "@/config/client";

// Better auth
export const {
  $Infer,
  admin,
  forgetPassword,
  resetPassword,
  sendVerificationEmail,
  signIn,
  signOut,
  signUp,
  useSession,
} = createAuthClient({
  baseURL: API_CLIENT_URL,
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error("Too many requests. Please try again later.");
      }
    },
  },
  plugins: [adminClient()],
});

export type Session = typeof $Infer.Session.session | null;
export type UserSession = typeof $Infer.Session.user | null;

// Hono RPC
export const { api: apiClient } = hc<App>(API_CLIENT_URL);

// SWR hooks
export async function fetchUser() {
  return apiClient.user.$get().then((res) => res.json());
}
