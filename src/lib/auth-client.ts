import { createAuthClient } from "better-auth/react";

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
