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

export const FREE_PLANS = [
  "none",
  "trial",
] as const;
export type FreePlan = (typeof FREE_PLANS)[number];

export const PAID_PLANS = [
  "basic",
  "pro",
  "premium",
] as const;
export type PaidPlan = (typeof PAID_PLANS)[number];
