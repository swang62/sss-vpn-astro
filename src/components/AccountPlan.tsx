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
  const description = plan ? ` tier - ${plan.features[0]} - $${plan.price}/month` : "";

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
              <span>Upgrade plan</span>
            </Button>
          </a>
        </div>
      ),
      value: capitalize(subscriptionType) + description,
    },
    {
      title: "Duration",
      value: endDate ? `Plan will end on ${endDate}` : billingCycle ? `Will renew on the ${billingCycle}` : `N/A`,
    },
    {
      title: "Auto-Renew",
      value: autoRenew,
    },
  ];

  return (
    <Card x-chunk="Plan details">
      <CardContent className="flex flex-col gap-4 py-4">
        {planDetails.map(({ title, value }, index) => (
          <div key={index}>
            <h1 className="h-8 my-2 text-xl font-semibold">{title}</h1>
            <div className="px-6 text-lg text-muted-foreground">
              {profile ? value : <Skeleton className="w-40 h-7" />}
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
                  disabled={isDisqualified}
                  loading={loading}
                  variant="secondary"
                  onClick={() => renewPlan(true)}
                >
                  <span>Re-enable subscription</span>
                </Button>
              )
            : (
                <Button
                  disabled={isDisqualified}
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

export default AccountPlan;
