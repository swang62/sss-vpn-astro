import { navigate } from "astro:transitions/client";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import type { SubscriptionType } from "@/config/types";

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
import { PLANS } from "@/config/links";
import { apiClient, fetchUser, parseApi, type User } from "@/lib/api-clients";
import { capitalize, cn } from "@/lib/utils";

export type PricingCardProps = {
  plan: SubscriptionType;
  price: number;
  description: string;
  features: string[];
  monthly?: boolean;
  user?: User;
};

function PricingCard({
  description,
  features,
  monthly,
  plan,
  price,
  user,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const title = capitalize(plan);
  const isCurrentPlan = user?.profile?.subscriptionType === plan;

  const onClickCheckout = async (plan: SubscriptionType) => {
    // create checkout session, then redirect
    setLoading(true);
    const { data } = await parseApi(
      apiClient.stripe["customer-portal"].$post({ json: { monthly, plan } }),
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
      className={cn(isCurrentPlan && "opacity-50", `mx-auto flex max-w-80 flex-col justify-between bg-background py-1 text-foreground sm:mx-0`)}
    >
      <div>
        <CardHeader className="pt-4 pb-6">
          <div className="flex justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            {user && plan.includes("basic") && (
              <div
                className={cn(
                  "h-fit rounded-xl px-2.5 py-1 text-sm",
                  "bg-gradient-to-r from-orange-300 to-rose-400 dark:text-black",
                )}
              >
                Recommended
              </div>
            )}
          </div>
          <div className="flex gap-0.5">
            <h3 className="text-3xl font-semibold">{`$${price}`}</h3>
            {!monthly ? <span className="flex items-end mb-1 text-sm"></span> : <span className="flex items-end mb-1 text-sm">/month</span>}
            {plan.includes("premium") && (
              <>
                <h3 className="text-3xl font-semibold">+$50</h3>
                <span className="flex items-end mb-1 text-sm">router</span>
              </>
            )}
          </div>
          <CardDescription className="h-10 pt-1.5">
            {description}
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
            ? <Button variant="outline" disabled>Current plan</Button>
            : <Button loading={loading} onClick={() => onClickCheckout(plan)}>{`Get ${title}`}</Button>}
        </CardFooter>
      )}
    </Card>
  );
}

interface Props {}

function PricingForm(_props: Props) {
  const { data } = useSWR("fetchUser", fetchUser);
  const [monthly, setMonthly] = useState(false);

  return (
    <div className="flex items-center flex-col py-4">
      <div className="flex justify-center gap-4 text-xl items-center">
        <span className={cn(monthly && "text-accent")}>Single month</span>
        <Switch
          checked={monthly}
          onCheckedChange={() => setMonthly(!monthly)}
        />
        <span className={cn(!monthly && "text-accent")}>Subscription</span>
      </div>
      <div className="flex flex-col justify-center mt-8 gap-8 sm:flex-row sm:flex-wrap">
        {PLANS.map((plan) => {
          return <PricingCard key={plan.plan} {...plan} user={data?.user} monthly={monthly} />;
        })}
      </div>
    </div>
  );
}

export default PricingForm;
