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

export type HiddifyUser = {
  current_usage_GB: number;
  enable: boolean;
  is_active: boolean;
  last_online: Date | null;
  mode: string;
  name: string;
  package_days: number;
  start_date: Date;
  usage_limit_GB: number;
  uuid: string;
};
