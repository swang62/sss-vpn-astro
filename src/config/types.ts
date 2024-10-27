export type MenuLink = {
  href: string;
  label: string;
  icon?: JSX.Element;
};

export const SUBSCRIPTION_PLANS = [
  "none",
  "trial",
  "basic",
  "pro",
  "premium",
] as const;

export type SubscriptionType = (typeof SUBSCRIPTION_PLANS)[number];

export const FREE_PLANS: SubscriptionType[] = ["none", "trial"] as const;

export const PAID_PLANS: SubscriptionType[] = [
  "none",
  "trial",
  "basic",
  "pro",
  "premium",
] as const;
