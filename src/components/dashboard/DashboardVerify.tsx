import { useState } from "react";
import { toast } from "sonner";

import type { UserDB } from "@/db/queries";

import { Button } from "@/components/ui/button";
import { MIN_WAIT_TIME } from "@/config/constants";
import { sendVerificationEmail } from "@/lib/auth-clients";
import { minutesPassedSince } from "@/lib/utils";

interface Props {
  user: UserDB;
}

function DashboardVerify({ user }: Props) {
  // Hooks
  const [sentEmail, setSentEmail] = useState("");

  // Handlers
  const onClickVerify = () => {
    const minutesSince = minutesPassedSince(sentEmail);
    if (minutesSince < MIN_WAIT_TIME) {
      toast.warning("Please wait a minute before trying again.");
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
    <div className="container mx-auto flex w-full max-w-xl flex-col items-center justify-center gap-4 text-center">
      <div>Please verify your email address first.</div>
      <div className="text-muted-foreground text-sm">
        Sometimes the email can be delayed or sent to your spam folder
      </div>

      <Button onClick={onClickVerify} data-umami-event="verify-email">
        Resend email
      </Button>
    </div>
  );
}

export default DashboardVerify;
