import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import type { Session, UserSession } from "@/lib/clients";

import { Button } from "@/components/ui/button";
import { apiClient, sendVerificationEmail } from "@/lib/clients";
import { secondsPassed } from "@/lib/utils";

async function getUser() {
  return apiClient.user.$get().then((res) => res.json());
}

interface Props {
  session: NonNullable<Session>;
  userSession: NonNullable<UserSession>;
}

function DashboardUI({ session, userSession }: Props) {
  // Hooks
  const [sentEmail, setSentEmail] = useState("");
  const { data } = useSWR("/api/user", getUser);
  const user = data?.user;
  const isVerified = userSession.emailVerified;

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
      email: userSession.email,
    });

    toast.success("Resent verification email.");
    setSentEmail(new Date().toISOString());
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 py-4">
      <code>{JSON.stringify({ session, user, userSession }, null, 2)}</code>
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
