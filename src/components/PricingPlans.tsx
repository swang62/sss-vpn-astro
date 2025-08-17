import { navigate } from "astro:transitions/client";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PRICING_PLANS } from "@/config/constants";
import { api, fetchUser, parseApi } from "@/lib/api-clients";
import { cn } from "@/lib/utils";

import PricingCard from "./PricingCard";

interface Props {}

function PricingPlans(_props: Props) {
  const [loading, setLoading] = useState(false);
  const { data } = useSWR("fetchUser", fetchUser);
  const [monthly, setMonthly] = useState(true);
  const isActive = !!data?.user?.profile?.subscriptionId;
  const purchasedRouter = data?.user?.profile?.purchasedRouter;

  const onClickRouter = async () => {
    setLoading(true);
    const { data } = await parseApi(api.stripe["buy-router"].$post());
    if (data?.url) {
      navigate(data.url);
    } else {
      toast.error("Unknown error, please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 flex flex-col items-center py-4">
      <div className="mb-4 flex flex-col items-center gap-6 text-center">
        <p className="max-w-md leading-normal sm:text-lg sm:leading-7">
          You have a choice between a single month or a monthly subscription
          (auto-renewal)
        </p>
        <div className="flex items-center justify-center gap-4 text-xl">
          <span className={cn({ "text-muted-foreground/60": monthly })}>
            1 Month
          </span>
          <Switch
            checked={monthly}
            onCheckedChange={() => setMonthly(!monthly)}
          />
          <span className={cn({ "text-muted-foreground/60": !monthly })}>
            Subscription
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {PRICING_PLANS.map((plan) => {
          return (
            <PricingCard
              key={plan.plan}
              {...plan}
              user={data?.user}
              monthly={monthly}
              isActive={isActive}
            />
          );
        })}
      </div>
      <div className="flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {data?.user && !purchasedRouter && isActive && (
          <div className="text-muted-foreground mt-8 px-8 text-center">
            Still want to purchase the router? Buy it separately
            <Button
              loading={loading}
              disabled={loading}
              variant="link"
              className="m-0 ml-1 p-0 text-base underline"
              onClick={onClickRouter}
            >
              here
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PricingPlans;
