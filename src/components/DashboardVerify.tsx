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
  const onClickVerify = async () => {
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
    <div className="flex flex-col w-full max-w-xl min-h-[90vh] py-4 mx-auto items-center justify-center gap-6 px-4">
      <span>Please verify your email address first.</span>
      <span className="text-center max-w-96">
        <span className="text-sm text-muted-foreground">Sometimes the email can be delayed by a couple minutes or sent to your spam folder</span>
      </span>

      <Button onClick={onClickVerify}>Click to resend</Button>
    </div>
  );
}

export default DashboardVerify;
