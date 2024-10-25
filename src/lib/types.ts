export type PricingCardProps = {
  plan: SubscriptionType;
  monthlyPrice: number;
  description: string;
  features: string[];
};

export const ALL_PLANS = ["none", "trial", "basic", "pro", "premium"] as const;
export type SubscriptionType = (typeof ALL_PLANS)[number];

export const FREE_PLANS: SubscriptionType[] = ["none", "trial"] as const;

export const PAID_PLANS: SubscriptionType[] = [
  "none",
  "trial",
  "basic",
  "pro",
  "premium",
] as const;
