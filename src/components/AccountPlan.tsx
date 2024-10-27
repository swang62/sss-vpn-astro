import { Rocket } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FREE_PLANS } from "@/config/types";
import { fetchUser } from "@/lib/api-clients";
import { capitalize } from "@/lib/utils";

interface Props {}

function AccountPlan(_props: Props) {
  const [loading, setLoading] = useState(false);
  const { data } = useSWR("fetchUser", fetchUser);
  const profile = data?.user?.profile;

  // Handlers
  const cancelPlan = async () => {
    setLoading(true);
    // immediately set plan to cancel on end and update billing cycle
    // mutate to update screen
    setLoading(false);
  };
  const renewPlan = async () => {
    setLoading(true);
    // set plan to renew on end
    // mutate to update screen, make sure free trial is blocked on server side
    setLoading(false);
  };

  const subType = profile?.subscriptionType;
  const isDisabled = (!!subType && FREE_PLANS.includes(subType));
  const endDate = profile?.subscriptionEndAt
    ? new Date(profile?.subscriptionEndAt || "").toLocaleDateString("us", { dateStyle: "long" })
    : "";
  const autoRenew = endDate ? <span className="text-red-500">Off</span> : <span className="text-green-500">On</span>;
  const planDetails = [
    {
      title: (
        <div className="flex items-center justify-between">
          <span>Plan type</span>
          <a href="/dashboard/pricing">
            <Button
              variant="outline"
              className="flex flex-nowrap"
            >
              <Rocket />
              <span>Upgrade plan</span>
            </Button>
          </a>
        </div>
      ),
      value: capitalize(profile?.subscriptionType),
    },
    {
      title: "Duration",
      value: `Plan will end on ${endDate}`,
    },
    {
      title: "Auto-renewal",
      value: autoRenew,
    },
  ];

  return (
    <Card x-chunk="Plan details">
      <CardContent className="flex flex-col gap-4 py-4">
        {planDetails.map(({ title, value }, index) => (
          <div key={index}>
            <h1 className="h-8 my-2 text-xl font-semibold">{title}</h1>
            <div className="px-4 text-muted-foreground">
              {profile ? value : <Skeleton className="w-40 h-6" />}
            </div>
          </div>
        ))}

      </CardContent>
      <CardFooter className="justify-end gap-4 py-4 border-t bg-accent">
        {!profile
          ? <Skeleton className="w-40 h-10" />
          : endDate
            ? (
                <Button
                  disabled={isDisabled}
                  loading={loading}
                  variant="secondary"
                  onClick={renewPlan}
                >
                  <span>Turn on auto-renewal</span>
                </Button>
              )
            : (
                <Button
                  disabled={isDisabled}
                  loading={loading}
                  variant="destructive"
                  onClick={cancelPlan}
                >
                  <span>Cancel subscription</span>
                </Button>
              )}
      </CardFooter>
    </Card>
  );
}

export default AccountPlan;
