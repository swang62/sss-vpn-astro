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
import { PRICING_PLANS } from "@/config/links";
import { FREE_PLANS } from "@/config/types";
import { apiClient, fetchUser, parseApi } from "@/lib/api-clients";
import { capitalize, dateToString, sleep } from "@/lib/utils";

interface Props {}

function AccountDetails(_props: Props) {
  const [loading, setLoading] = useState(false);
  const { data, mutate } = useSWR("fetchUser", fetchUser);
  const profile = data?.user?.profile;

  // Handlers
  const renewPlan = async (renew: boolean) => {
    setLoading(true);
    const { error } = await parseApi(
      apiClient.stripe["renew-plan"].$post({ json: { renew } }),
    );
    if (!error) {
      await sleep(2000);
      await mutate();
    } else {
      toast.error("Failed to update subscription, please try again later.");
    }
    setLoading(false);
  };

  const endDate = profile?.subscriptionEndAt
    ? new Date(profile?.subscriptionEndAt).toLocaleDateString("us", { dateStyle: "long" })
    : "";
  const billingCycle = profile?.subscriptionStartAt
    ? dateToString(new Date(profile?.subscriptionStartAt).getDate())
    : "";
  const subscriptionType = profile?.subscriptionType;
  const plan = PRICING_PLANS.find(plan => plan.plan === subscriptionType);
  const description = plan ? ` tier • ${plan.features[0]}` : "";

  const isDisqualified = !!subscriptionType && FREE_PLANS.includes(subscriptionType as any);
  const autoRenew = isDisqualified || endDate ? <span className="text-red-500">Off</span> : <span className="text-green-500">On</span>;
  const planDetails = [
    {
      title: (
        <div className="flex items-center justify-between">
          <span>Plan</span>
          <a href="/dashboard/pricing">
            <Button
              variant="outline"
              className="flex flex-nowrap"
            >
              <Rocket />
              <span>Upgrade</span>
            </Button>
          </a>
        </div>
      ),
      value: capitalize(subscriptionType) + description,
    },
    {
      title: "Subscription",
      value: endDate
        ? `Will end on ${endDate}`
        : billingCycle && subscriptionType !== "none"
          ? `Will renew every month on the ${billingCycle}`
          : `N/A`,
    },
    {
      title: "Auto-renewal",
      value: autoRenew,
    },
  ];

  return (
    <Card x-chunk="Plan details">
      <CardContent className="flex flex-col gap-6 py-6">
        {planDetails.map(({ title, value }, index) => (
          <div key={index}>
            <h1 className="h-8 mb-1 text-xl font-semibold">{title}</h1>
            <div className="text-muted-foreground">
              {profile ? value : <Skeleton className="w-56 h-6" />}
            </div>
          </div>
        ))}

      </CardContent>
      <CardFooter className="justify-end gap-4 py-4 border-t bg-muted">
        {!profile
          ? <Skeleton className="w-56 h-10" />
          : endDate
            ? (
                <Button
                  disabled={loading || isDisqualified}
                  loading={loading}
                  variant="secondary"
                  onClick={() => renewPlan(true)}
                >
                  <span>Enable auto-renewal</span>
                </Button>
              )
            : (
                <Button
                  disabled={loading || isDisqualified}
                  loading={loading}
                  variant="destructive"
                  onClick={() => renewPlan(false)}
                >
                  <span>Cancel subscription</span>
                </Button>
              )}
      </CardFooter>
    </Card>
  );
}

export default AccountDetails;
