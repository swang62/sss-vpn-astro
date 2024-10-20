export type MainMenuLink = {
  href: string;
  label: string;
};

export const subscriptions = ["trial", "basic", "pro", "premium"] as const;
export type Subscription = (typeof subscriptions)[number];

export type PricingCardProps = {
  plan: Subscription;
  monthlyPrice: number;
  description: string;
  features: string[];
};
