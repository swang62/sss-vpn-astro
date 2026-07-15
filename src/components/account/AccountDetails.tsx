import { Ban, CreditCard, Rocket, RotateCcw } from "lucide-react";
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
  const description = plan ? plan.features[0] : "";
  const planTier = subscriptionType === "none" ? "-" : subscriptionType;

  const isDisqualified =
    !!subscriptionType && FREE_PLANS.includes(subscriptionType as FreePlan);
  const autoRenewOn = !isDisqualified && !endDate;

  useEffect(() => {
    if (!profile?.hiddifyId) {
      setIntervalId(
        setInterval(async () => {
          const d = await mutate();
          if (d?.user?.profile?.hiddifyId) {
            clearInterval(intervalId);
          }
        }, 2000)
      );
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [profile?.hiddifyId]);

  useEffect(() => {
    if (loading) {
      setIntervalId(
        setInterval(async () => {
          const d = await mutate();
          if (d?.user?.profile?.updatedAt !== profile?.updatedAt) {
            setLoading(false);
            clearInterval(intervalId);
          }
        }, 2000)
      );
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [loading, profile?.updatedAt]);

  return (
    <Card x-chunk="Plan details">
      <CardHeader>
        <div className="flex items-center gap-2">
          {/*<CreditCard className="size-5 text-primary" />*/}
          <CardTitle className="translate-y-px font-heading">
            Plan details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/20 p-4">
          <span className="text-muted-foreground text-xs">Tier</span>
          {profile ? (
            <span className="flex items-center gap-2 font-heading font-semibold text-xl">
              {capitalize(planTier)}
              {description && (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium font-mono text-[11px] text-primary tracking-wider">
                  {description}
                </span>
              )}
            </span>
          ) : (
            <Skeleton className="h-7 w-48" />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/20 p-3">
            <span className="text-muted-foreground text-xs">Billing cycle</span>
            {profile ? (
              <span className="font-medium text-sm leading-tight">
                {endDate
                  ? `Ends on ${endDate}`
                  : billingCycle && subscriptionType !== "none"
                    ? `Renews on the ${billingCycle}`
                    : "-"}
              </span>
            ) : (
              <Skeleton className="h-5 w-28" />
            )}
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/20 p-3">
            <span className="text-muted-foreground text-xs">Auto renew</span>
            {profile ? (
              <span
                className={`font-mono font-semibold text-xs uppercase tracking-wider ${autoRenewOn ? "text-green-500" : "text-red-500"}`}
              >
                {autoRenewOn ? "On" : "Off"}
              </span>
            ) : (
              <Skeleton className="h-4 w-8" />
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row flex-wrap items-center justify-end gap-2">
        <a href="/dashboard/pricing">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Rocket className="size-3.5 text-primary" />
            <span>Upgrade</span>
          </Button>
        </a>
        {endDate ? (
          <Button
            disabled={!profile || loading || isDisqualified}
            loading={loading}
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={() => renewPlan(true)}
          >
            <RotateCcw className="size-3.5" />
            Enable auto-renew
          </Button>
        ) : (
          <Button
            disabled={!profile || loading || isDisqualified}
            loading={loading}
            variant="destructive"
            size="sm"
            className="gap-1.5"
            onClick={() => renewPlan(false)}
          >
            <Ban className="size-3.5" />
            Cancel subscription
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default AccountDetails;
