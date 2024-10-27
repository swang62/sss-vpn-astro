import { Rocket } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FREE_PLANS } from "@/config/types";
import { apiClient, fetchUser, parseApi } from "@/lib/api-clients";
import { capitalize } from "@/lib/utils";

interface Props {}

function AccountPlan(_props: Props) {
  const [loading, setLoading] = useState(false);
  const { data, mutate } = useSWR("fetchUser", fetchUser);
  const profile = data?.user?.profile;

  // Handlers
  const renewPlan = async (renew: boolean) => {
    setLoading(true);
    const { error } = await parseApi(
      apiClient.stripe.renew.$post({ json: { renew } }),
    );
    if (!error) {
      await mutate();
    } else {
      toast.error("Failed to update subscription, please try again later.");
    }
    setLoading(false);
  };

  const subType = profile?.subscriptionType;
  const isDisabled = !!subType && FREE_PLANS.includes(subType);
  const endDate = profile?.subscriptionEndAt
    ? new Date(profile?.subscriptionEndAt).toLocaleDateString("us", { dateStyle: "long" })
    : "";
  const billingCycle = profile?.subscriptionStartAt
    ? new Date(profile?.subscriptionStartAt).getDate().toString()
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
      value: endDate ? `Plan will end on ${endDate}` : billingCycle ? `Will renew on the ${billingCycle}` : `None`,
    },
    {
      title: "Auto-Renewal",
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
                  onClick={() => renewPlan(true)}
                >
                  <span>Re-enable plan</span>
                </Button>
              )
            : (
                <Button
                  disabled={isDisabled}
                  loading={loading}
                  variant="destructive"
                  onClick={() => renewPlan(false)}
                >
                  <span>Cancel plan</span>
                </Button>
              )}
      </CardFooter>
    </Card>
  );
}

export default AccountPlan;
