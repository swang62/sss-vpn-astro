export type MenuLink = {
  href: string;
  label: string;
};

export type PricingCardProps = {
  plan: Subscription;
  monthlyPrice: number;
  description: string;
  features: string[];
};

export const subscriptions = [
  "none",
  "trial",
  "basic",
  "pro",
  "premium",
] as const;
export type Subscription = (typeof subscriptions)[number];
