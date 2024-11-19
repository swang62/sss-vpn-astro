import { navigate } from "astro:transitions/client";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import type { PaidPlan } from "@/config/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { PRICING_PLANS } from "@/config/links";
import { apiClient, fetchUser, parseApi, type User } from "@/lib/api-clients";
import { capitalize, cn } from "@/lib/utils";

export type PricingCardProps = {
  plan: PaidPlan;
  price: number;
  description: string;
  features: string[];
};

function PricingCard({
  description,
  features,
  isActive,
  monthly,
  plan,
  price,
  user,
}: PricingCardProps & { monthly: boolean; isActive: boolean; user?: User }) {
  const [loading, setLoading] = useState(false);
  const title = capitalize(plan);
  const isCurrentPlan = isActive && user?.profile?.subscriptionType === plan;
  const hasPurchasedRouter = user?.profile?.purchasedRouter;

  const onClickCheckout = async () => {
    setLoading(true);
    const { data } = isActive
      ? await parseApi(
        apiClient.stripe["customer-portal"].$post({ json: { plan } }),
      )
      : await parseApi(
        apiClient.stripe.checkout.$post({ json: { monthly, plan } }),
      );
    if (data?.url) {
      navigate(data.url);
    } else {
      toast.error("Unknown error, please try again later.");
      setLoading(false);
    }
  };

  const onClickAddData = async () => {
    setLoading(true);
    const { data } = await parseApi(
      apiClient.stripe["add-data"].$post(),
    );
    if (data?.url) {
      navigate(data.url);
    } else {
      toast.error("Unknown error, please try again later.");
      setLoading(false);
    }
  };

  return (
    <Card
      className={cn(`mx-auto flex max-w-80 flex-col justify-between bg-background py-1 text-foreground sm:mx-0`, user && isCurrentPlan && "border-rose-400")}
    >
      <div>
        <CardHeader className="pt-4 pb-6">
          <div className="flex justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            {user && plan.includes("basic") && !isActive && (
              <div
                className={cn(
                  "h-fit rounded-xl px-2.5 py-1 text-sm",
                  "bg-gradient-to-r from-orange-300 to-rose-400 dark:text-black",
                )}
              >
                Recommended
              </div>
            )}
            {user && isCurrentPlan && (
              <div
                className={cn(
                  "h-fit rounded-xl px-2.5 py-1 text-sm",
                  "bg-gradient-to-r from-orange-300 to-rose-300 dark:text-black",
                )}
              >
                Current plan
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-0.5">
            <span className="inline-flex">
              <h3 className="text-3xl font-semibold">{`$${price}`}</h3>
              {!monthly && !isActive
                ? <span className="flex items-end mb-1 text-sm"></span>
                : <span className="flex items-end mb-1 text-sm">/month</span>}
            </span>
            {plan.includes("premium") && !hasPurchasedRouter && !isActive && (
              <span className="inline-flex">
                <h3 className="text-3xl font-semibold">+$60</h3>
                <span className="flex items-end mb-1 text-sm">router</span>
              </span>
            )}
          </div>
          <CardDescription className="pt-1.5">
            {plan.includes("premium") && (hasPurchasedRouter || isActive) ? "Even more data! Router not included (see below)" : description }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string) => (
            <div key={feature} className="flex gap-2">
              <CheckCircle2 size={18} className="my-auto text-green-500" />
              <p className="w-11/12 pt-0.5 text-sm">{feature}</p>
            </div>
          ))}
        </CardContent>
      </div>
      {user && (
        <CardFooter className="flex justify-center mt-2">
          {isCurrentPlan
            ? (
                <div className="flex gap-2">
                  <Button loading={loading} disabled={loading} onClick={onClickAddData}>Add more data</Button>
                  <a href="/dashboard/account"><Button variant="outline">Manage</Button></a>
                </div>
              )
            : (
                <Button loading={loading} disabled={loading} onClick={onClickCheckout}>
                  {isActive ? `Switch to ` : `Get `}
                  {title}
                </Button>
              )}
        </CardFooter>
      )}
    </Card>
  );
}

interface Props {}

function PricingPlans(_props: Props) {
  const [loading, setLoading] = useState(false);
  const { data } = useSWR("fetchUser", fetchUser);
  const [monthly, setMonthly] = useState(true);
  const isActive = !!data?.user?.profile?.subscriptionId;
  const purchasedRouter = data?.user?.profile?.purchasedRouter;

  const onClickRouter = async () => {
    setLoading(true);
    const { data } = await parseApi(
      apiClient.stripe["buy-router"].$post(),
    );
    if (data?.url) {
      navigate(data.url);
    } else {
      toast.error("Unknown error, please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-4 mb-8">
      {data?.user && !isActive && (
        <div className="flex flex-col items-center gap-6 mb-4 text-center">
          <p className="max-w-md leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            You have a choice between buying a single month or a regular subscription
          </p>
          <div className="flex items-center justify-center gap-4 text-xl">
            <span className={cn(monthly && "text-muted-foreground")}>Single month</span>
            <Switch
              checked={monthly}
              onCheckedChange={() => setMonthly(!monthly)}
            />
            <span className={cn(!monthly && "text-muted-foreground")}>Subscription</span>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center gap-8 mt-4 sm:flex-row sm:flex-wrap">
        {PRICING_PLANS.map((plan) => {
          return <PricingCard key={plan.plan} {...plan} user={data?.user} monthly={monthly} isActive={isActive} />;
        })}
      </div>
      <div className="flex flex-col justify-center gap-8 sm:flex-row sm:flex-wrap">
        {data?.user && !purchasedRouter && isActive && (
          <div className="px-8 mt-8 text-center text-muted-foreground">
            Still want to purchase the router package? Buy it separately
            <Button loading={loading} disabled={loading} variant="link" className="p-0 m-0 ml-1 text-base underline" onClick={onClickRouter}>here</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PricingPlans;
