import { Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PRICING_PLANS } from "@/config/constants";
import { FREE_PLANS, type FreePlan } from "@/config/types";
import { api, fetchUser, parseApi } from "@/lib/api-clients";
import { capitalize, dateToString } from "@/lib/utils";

function AccountDetails() {
  const [loading, setLoading] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const { data, mutate } = useSWR("fetchUser", fetchUser);
  const user = data?.user;
  const profile = user?.profile;

  // Handlers
  const renewPlan = async (renew: boolean) => {
    setLoading(true);
    const { error } = await parseApi(
      api.stripe["renew-plan"].$post({ json: { renew } })
    );
    if (error) {
      toast.error("Failed to update subscription, please try again later.");
      setLoading(false);
    }
  };

  const endDate = profile?.subscriptionEndAt
    ? new Date(profile?.subscriptionEndAt).toLocaleDateString("us", {
        dateStyle: "medium",
      })
    : "";
  const billingCycle = profile?.subscriptionStartAt
    ? dateToString(new Date(profile?.subscriptionStartAt).getDate())
    : "";
  const subscriptionType = profile?.subscriptionType;
  const plan = PRICING_PLANS.find((plan) => plan.plan === subscriptionType);
  const description = plan ? ` • ${plan.features[0]}` : "";

  const isDisqualified =
    !!subscriptionType && FREE_PLANS.includes(subscriptionType as FreePlan);
  const autoRenew =
    isDisqualified || endDate ? (
      <span className="text-red-500">Off</span>
    ) : (
      <span className="text-green-500">On</span>
    );
  const planDetails = [
    {
      title: <div>Plan</div>,
      value: capitalize(subscriptionType) + description,
    },
    {
      title: "Billing cycle",
      value: endDate
        ? `Will end on ${endDate}`
        : billingCycle && subscriptionType !== "none"
          ? `Will renew every month on the ${billingCycle}`
          : `N/A`,
    },
    {
      title: "Auto-renew",
      value: autoRenew,
    },
  ];

  // Poll for hiddify profile creation
  useEffect(() => {
    if (!profile?.hiddifyId) {
      setIntervalId(
        setInterval(async () => {
          const data = await mutate();
          if (data?.user?.profile?.hiddifyId) {
            clearInterval(intervalId);
          }
        }, 2000)
      );
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [profile?.hiddifyId, intervalId, mutate]);

  // Poll for stripe subscription renewal
  useEffect(() => {
    if (loading) {
      setIntervalId(
        setInterval(async () => {
          const data = await mutate();
          if (data?.user?.profile?.updatedAt !== profile?.updatedAt) {
            setLoading(false);
            clearInterval(intervalId);
          }
        }, 2000)
      );
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [loading, profile?.updatedAt, mutate, intervalId]);

  return (
    <Card x-chunk="Plan details">
      <CardContent className="flex flex-col gap-6">
        {planDetails.map(({ title, value }, index) => (
          <div key={index}>
            <h1 className="mb-1 h-8 font-semibold text-xl">{title}</h1>
            <div className="text-muted-foreground">
              {profile ? value : <Skeleton className="h-6 w-56" />}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-row flex-wrap items-center justify-end gap-2">
        <a href="/dashboard/pricing">
          <Button variant="outline" className="px-0">
            <Rocket className="text-orange-400" />
            <span className="text-foreground">Upgrade</span>
          </Button>
        </a>
        {!profile ? (
          <Skeleton className="h-10 w-56" />
        ) : endDate ? (
          <Button
            disabled={loading || isDisqualified}
            loading={loading}
            variant="secondary"
            onClick={() => renewPlan(true)}
          >
            Enable auto-renew
          </Button>
        ) : (
          <Button
            disabled={loading || isDisqualified}
            loading={loading}
            variant="destructive"
            onClick={() => renewPlan(false)}
          >
            Cancel subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default AccountDetails;
