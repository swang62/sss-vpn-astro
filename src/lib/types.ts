export type PricingCardProps = {
  plan: SubscriptionType;
  monthlyPrice: number;
  description: string;
  features: string[];
};

export const subscription = [
  "none",
  "trial",
  "basic",
  "pro",
  "premium",
] as const;

export type SubscriptionType = (typeof subscription)[number];
