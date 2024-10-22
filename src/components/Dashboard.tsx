import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { sendVerificationEmail, type User } from "@/lib/clients";

interface Props {
  user: User;
}

export function secondsPassed(modified: string) {
  const now = new Date().getTime();
  const compare = new Date(modified).getTime();

  return Math.floor((now - compare) / 1000);
}

function DashboardUI({ user }: Props) {
  // Setup
  const [sentEmail, setSentEmail] = useState("");
  const isVerified = user.emailVerified;

  // Handlers
  const onClickVerify = async () => {
    const timeSince = secondsPassed(sentEmail);
    if (timeSince < 30) {
      toast.warning(`Please wait ${30 - timeSince}s before trying again.`);
      return;
    }

    sendVerificationEmail({
      callbackURL: "/dashboard",
      email: user.email,
    });
    toast.success("Resent verification email.");
    setSentEmail(new Date().toISOString());
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 py-4">
      <code>{JSON.stringify(user, null, 2)}</code>
      {!isVerified && (
        <div className="mx-auto flex flex-col items-center justify-center gap-4">
          <span>Please verify your email address first.</span>
          <Button onClick={onClickVerify}>Click to resend email</Button>
        </div>
      )}
    </div>
  );
}

export default DashboardUI;
