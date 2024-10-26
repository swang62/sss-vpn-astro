import { ArrowRight, CheckCircle2 } from "lucide-react";

import type { PricingCardProps } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalize, cn } from "@/lib/utils";

function PricingHeader({
  subtitle,
  title,
}: {
  subtitle: string;
  title: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center pb-3 mx-auto text-center gap-4">
      <h2 className="font-heading text-3xl leading-[1.1] sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="max-w-lg leading-normal text-muted-foreground sm:text-lg sm:leading-7">
        {subtitle}
      </p>
    </div>
  );
}

function PricingCard({
  description,
  features,
  monthlyPrice,
  plan,
}: PricingCardProps) {
  const title = capitalize(plan);
  return (
    <Card
      className={cn(
        `mx-auto flex max-w-80 flex-col justify-between bg-background py-1 text-foreground sm:mx-0`,
      )}
    >
      <div>
        <CardHeader className="pt-4 pb-6">
          <div className="flex justify-between">
            <CardTitle className="text-xl text-foreground">{title}</CardTitle>
            {/* {plan.includes("basic") && (
              <div
                className={cn(
                  "h-fit rounded-xl px-2.5 py-1 text-sm",
                  "bg-gradient-to-r from-orange-300 to-rose-400 dark:text-black",
                )}
              >
                Recommended
              </div>
            )} */}
          </div>
          <div className="flex gap-0.5">
            <h3 className="text-3xl font-semibold">{`$${monthlyPrice}`}</h3>
            <span className="flex items-end mb-1 text-sm">/month</span>
            {plan.includes("premium") && (
              <>
                <span className="flex items-center px-2 text-2xl font-semibold">
                  +
                </span>
                <h3 className="text-3xl font-semibold">$50</h3>
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
      {/* <CardFooter className="flex justify-center mt-2">
          <Button>{`Get ${title}`}</Button>∂
      </CardFooter> */}
    </Card>
  );
}

function Pricing() {
  const plans: PricingCardProps[] = [
    {
      description: "Should be enough data for most people",
      features: [
        "50GB data",
        "Email, messaging, music, blogs, light media usage",
        "Desktop & phone apps",
      ],
      monthlyPrice: 5,
      plan: "basic",
    },
    {
      description: "Good for heavy streaming/media usage",
      features: [
        "150GB data",
        "Heavy streaming, gaming, video conferencing",
        "More data!",
      ],
      monthlyPrice: 10,
      plan: "pro",
    },
    {
      description:
        "For multiple people, family members, or lots of IoT devices",
      features: [
        "300GB data",
        "Fully pre-configured WiFi6 router",
        "Remote support available",
        "Domestic shipping only*",
      ],
      monthlyPrice: 20,
      plan: "premium",
    },
  ];

  return (
    <section id="pricing" className="container py-8 sm:py-16">
      <div className="py-8">
        <PricingHeader
          title="Simple pricing"
          subtitle="Just some money for me to cover server costs, thanks. FYI, an hour of HD streaming uses around 1-2GB."
        />

        <div className="flex flex-col justify-center mt-8 gap-8 sm:flex-row sm:flex-wrap">
          {plans.map((plan) => {
            return <PricingCard key={plan.plan} {...plan} />;
          })}
        </div>

        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <div className="leading-normal text-balance text-muted-foreground sm:text-lg sm:leading-7">
            Try it out first before picking a plan
          </div>
          <a href="/signup" data-astro-reload>
            <Button className="rounded-full" variant="secondary">
              Get started
              <ArrowRight className="size-6" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
