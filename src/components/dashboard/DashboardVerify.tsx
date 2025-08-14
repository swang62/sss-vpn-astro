import { useState } from "react";
import { toast } from "sonner";

import type { UserDB } from "@/db/queries";

import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/lib/auth-client";
import { secondsPassed } from "@/lib/utils";

interface Props {
  user: UserDB;
}

function DashboardVerify({ user }: Props) {
  // Hooks
  const [sentEmail, setSentEmail] = useState("");

  // Handlers
  const onClickVerify = () => {
    const minutesSince = Math.floor(secondsPassed(sentEmail) / 60);
    if (minutesSince < 3) {
      toast.warning(
        `Please wait at least ${3 - minutesSince} minutes before trying again.`,
      );
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
    <div className="container flex flex-col w-full max-w-xl mx-auto items-center justify-center gap-6">
      <div>Please verify your email address first.</div>
      <div className="text-center max-w-96">
        <span className="text-sm text-muted-foreground">Sometimes the email can be delayed by a couple minutes or sent to your spam folder</span>
      </div>

      <Button onClick={onClickVerify}>Click to resend</Button>
    </div>
  );
}

export default DashboardVerify;
