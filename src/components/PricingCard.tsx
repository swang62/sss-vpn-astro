import { navigate } from "astro:transitions/client";
import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import type { PricingPlan } from "@/config/types";
import type { User } from "@/lib/api-clients";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, parseApi } from "@/lib/api-clients";
import { capitalize, cn } from "@/lib/utils";

interface PricingCardProps extends PricingPlan {
  monthly?: boolean;
  isActive?: boolean;
  user?: User;
}

function PricingCard({
  description,
  features,
  isActive = false,
  monthly = true,
  plan,
  price,
  user,
}: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const title = capitalize(plan);
  const isCurrentPlan = isActive && user?.profile?.subscriptionType === plan;
  const hasPurchasedRouter = user?.profile?.purchasedRouter;

  const onClickCheckout = async () => {
    setLoading(true);
    const { data } = isActive
      ? await parseApi(api.stripe["customer-portal"].$post({ json: { plan } }))
      : await parseApi(api.stripe.checkout.$post({ json: { monthly, plan } }));
    if (data?.url) {
      navigate(data.url);
    } else {
      toast.error("Unknown error, please try again later.");
      setLoading(false);
    }
  };

  const onClickAddData = async () => {
    setLoading(true);
    const { data } = await parseApi(api.stripe["add-data"].$post());
    if (data?.url) {
      navigate(data.url);
    } else {
      toast.error("Unknown error, please try again later.");
      setLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        `bg-background text-foreground mx-auto flex max-w-80 flex-col justify-between pt-2 sm:mx-0`,
        user && isCurrentPlan && "border-rose-400"
      )}
    >
      <div>
        <CardHeader className="pt-4 pb-6">
          <div className="flex justify-between">
            <CardTitle>{title}</CardTitle>
            {user && plan.includes("basic") && !isActive && (
              <div
                className={cn(
                  "h-fit rounded-xl px-2.5 py-1 text-sm",
                  "bg-linear-to-r from-orange-300 to-rose-400 dark:text-black"
                )}
              >
                Recommended
              </div>
            )}
            {user && isCurrentPlan && (
              <div
                className={cn(
                  "h-fit rounded-xl px-2.5 py-1 text-sm",
                  "bg-linear-to-r from-orange-300 to-rose-300 dark:text-black"
                )}
              >
                Current plan
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-0.5">
            <span className="inline-flex">
              <h3 className="text-3xl font-semibold">{`$${price}`}</h3>
              {monthly && (
                <span className="mb-1 flex items-end text-sm">/month</span>
              )}
            </span>
            {plan.includes("premium") && !hasPurchasedRouter && !isActive && (
              <span className="inline-flex">
                <h3 className="text-3xl font-semibold">+$60</h3>
                <span className="mb-1 flex items-end text-sm">router</span>
              </span>
            )}
          </div>
          <CardDescription className="min-h-12 pt-1.5">
            {plan.includes("premium") && (hasPurchasedRouter || isActive)
              ? "Give me all the data!"
              : description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {features.map((feature: string) => (
            <div key={feature} className="flex gap-2">
              <BadgeCheck size={18} className="my-auto text-green-500" />
              <p className="w-11/12 pt-0.5 text-sm">{feature}</p>
            </div>
          ))}
        </CardContent>
      </div>
      {user && (
        <CardFooter className="flex justify-center pb-6">
          {isCurrentPlan ? (
            <div className="flex gap-2">
              <Button
                loading={loading}
                disabled={loading}
                onClick={onClickAddData}
              >
                + Add data
              </Button>
              <a href="/dashboard/account">
                <Button variant="outline">Manage</Button>
              </a>
            </div>
          ) : (
            <Button
              loading={loading}
              disabled={loading}
              onClick={onClickCheckout}
            >
              {isActive ? `Switch to ` : `Get `}
              {title}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export default PricingCard;
