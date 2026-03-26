import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { toast } from "sonner";

import { SITE_URL } from "@/config/client";

// Better auth
export const {
  $Infer,
  admin,
  requestPasswordReset,
  resetPassword,
  revokeSession,
  sendVerificationEmail,
  signIn,
  signOut,
  signUp,
  useSession,
} = createAuthClient({
  baseURL: SITE_URL,
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
