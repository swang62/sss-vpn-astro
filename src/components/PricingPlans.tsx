import { navigate } from "astro:transitions/client";
import { Calendar, Repeat } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { PRICING_PLANS } from "@/config/constants";
import { api, fetchUser, parseApi } from "@/lib/api-clients";
import { cn } from "@/lib/utils";

import PricingCard from "./PricingCard";

function PricingPlans() {
  const [loading, setLoading] = useState(false);
  const { data } = useSWR("fetchUser", fetchUser);
  const [monthly, setMonthly] = useState(true);
  const isActive = !!data?.user?.profile?.subscriptionId;
  const purchasedRouter = data?.user?.profile?.purchasedRouter;

  const onClickRouter = async () => {
    setLoading(true);
    const result = await parseApi(api.stripe["buy-router"].$post);
    setLoading(false);
    if (result.ok && result.data?.url) {
      navigate(result.data.url);
    } else {
      toast.error("Unknown error, please try again later.");
    }
  };

  return (
    <div className="mb-8 flex flex-col items-center py-4">
      <div className="mb-4 flex flex-col items-center gap-6 text-center">
        <p className="max-w-sm leading-normal sm:text-lg sm:leading-7">
          Choose between a monthly subscription or a single month
        </p>
        <div className="relative flex rounded-full border border-border/60 bg-muted p-0.5">
          <div
            className="toggle-slider"
            style={{
              transform: monthly ? "translateX(0)" : "translateX(100%)",
            }}
          />
          <button
            type="button"
            onClick={() => setMonthly(true)}
            className={cn(
              "relative z-10 flex w-36 cursor-pointer items-center justify-center gap-2 rounded-full px-2 py-2 font-medium text-sm transition-colors",
              monthly
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Repeat className="size-4" />
            Subscription
          </button>
          <button
            type="button"
            onClick={() => setMonthly(false)}
            className={cn(
              "relative z-10 flex w-36 cursor-pointer items-center justify-center gap-2 rounded-full px-2 py-2 font-medium text-sm transition-colors",
              !monthly
                ? "text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Calendar className="size-4" />1 Month
          </button>
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
      <div className="flex max-w-xl flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {data?.user && !purchasedRouter && isActive && (
          <div className="mt-8 px-2 text-center text-muted-foreground">
            Still want to purchase the router? Buy it
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
