import { CreditCard, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

  const renewPlan = async (renew: boolean) => {
    setLoading(true);
    const result = await parseApi(api.stripe["renew-plan"].$post, {
      json: { renew },
    });

    if (!result.ok) {
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
  const description = plan ? ` ${plan.features[0]}` : "";

  const isDisqualified =
    !!subscriptionType && FREE_PLANS.includes(subscriptionType as FreePlan);
  const autoRenew =
    isDisqualified || endDate ? (
      <span className="font-mono font-semibold text-red-500 text-sm uppercase tracking-wider">
        Off
      </span>
    ) : (
      <span className="font-mono font-semibold text-green-500 text-sm uppercase tracking-wider">
        On
      </span>
    );

  const planDetails = [
    {
      label: "Plan",
      value: `${capitalize(subscriptionType)} · ${description.trim()}`,
    },
    {
      label: "Billing cycle",
      value: endDate
        ? `Ends on ${endDate}`
        : billingCycle && subscriptionType !== "none"
          ? `Renews monthly on the ${billingCycle}`
          : "N/A",
    },
    {
      label: "Auto-renew",
      value: autoRenew,
    },
  ];

  useEffect(() => {
    if (!profile?.hiddifyId) {
      const id = setInterval(async () => {
        const d = await mutate();
        if (d?.user?.profile?.hiddifyId) {
          clearInterval(id);
        }
      }, 2000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
    return () => {};
  }, [profile?.hiddifyId]);

  useEffect(() => {
    if (loading) {
      const id = setInterval(async () => {
        const d = await mutate();
        if (d?.user?.profile?.updatedAt !== profile?.updatedAt) {
          setLoading(false);
          clearInterval(id);
        }
      }, 2000);
      setIntervalId(id);
      return () => clearInterval(id);
    }
    return () => {};
  }, [loading, profile?.updatedAt]);

  return (
    <Card x-chunk="Plan details">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CreditCard className="size-5 text-primary" />
          <CardTitle className="translate-y-px font-heading">
            Plan details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {planDetails.map(({ label, value }, index) => (
          <div key={index}>
            <span className="font-medium text-muted-foreground text-sm">
              {label}
            </span>
            <div className="mt-1 text-foreground">
              {profile ? value : <Skeleton className="h-6 w-56" />}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex flex-row flex-wrap items-center justify-end gap-2">
        <a href="/dashboard/pricing">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Rocket className="size-3.5 text-primary" />
            <span>Upgrade Plan</span>
          </Button>
        </a>
        {!profile ? (
          <Skeleton className="h-9 w-44" />
        ) : endDate ? (
          <Button
            disabled={loading || isDisqualified}
            loading={loading}
            variant="secondary"
            size="sm"
            onClick={() => renewPlan(true)}
          >
            Enable auto-renew
          </Button>
        ) : (
          <Button
            disabled={loading || isDisqualified}
            loading={loading}
            variant="destructive"
            size="sm"
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
