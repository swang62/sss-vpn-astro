import { useState } from "react";
import { toast } from "sonner";

import type { UserSession } from "@/lib/clients";

import { Button } from "@/components/ui/button";
import { sendVerificationEmail } from "@/lib/clients";
import { secondsPassed } from "@/lib/utils";

// async function getUser(id: string) {
//   return apiServer.user[":id"]
//     .$get({ param: { id } })
//     .then(async (res) => await res.json());
// }

interface Props {
  userSession: UserSession;
}

function DashboardUI({ userSession }: Props) {
  // Hooks
  const [sentEmail, setSentEmail] = useState("");
  const isVerified = userSession.emailVerified;

  // const { data } = useSWR(userId, getUser);
  // const user = data?.user;

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
      <code>{JSON.stringify(userSession, null, 2)}</code>
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
