import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { fetchUser } from "@/lib/api-clients";
import { sendVerificationEmail } from "@/lib/auth-client";
import { secondsPassed } from "@/lib/utils";

interface Props {}

function DashboardUI(_props: Props) {
  // Hooks
  const [sentEmail, setSentEmail] = useState("");
  const { data } = useSWR("fetchUser", fetchUser);
  const user = data?.user;
  const isVerified = user?.emailVerified;

  // Handlers
  const onClickVerify = async () => {
    if (!user) return;

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
    <div className="flex flex-col w-full py-4 gap-4">
      <code>{JSON.stringify(user, null, 2)}</code>
      {user && !isVerified && (
        <div className="flex flex-col items-center justify-center mx-auto gap-4">
          <span>Please verify your email address first.</span>
          <Button onClick={onClickVerify}>Click to Resend Email</Button>
        </div>
      )}
    </div>
  );
}

export default DashboardUI;
