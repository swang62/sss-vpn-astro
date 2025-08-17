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

export const SUBSCRIPTION_PLANS = [
  ...FREE_PLANS,
  ...PAID_PLANS,
] as const;
export type SubscriptionType = (typeof SUBSCRIPTION_PLANS)[number];

export type PricingPlan = {
  plan: PaidPlan;
  price: number;
  description: string;
  features: string[];
};

export type Platform
  = "ios"
    | "android"
    | "mac"
    | "pc";

export const HIDDIFY_SERVER_IDS = [
  "1",
  "2",
] as const;
export type HiddifyServerId = (typeof HIDDIFY_SERVER_IDS)[number];

export type HiddifyServer = {
  baseUrl: string;
  setupLink: string;
  ip: string;
};

export type HiddifyUser = {
  current_usage_GB: number; // Can't be set
  enable: boolean; // Is this user allowed to connect to VPN
  is_active: boolean; // Is user actively using VPN
  last_online: Date | null;
  mode: "no_reset" | "monthly";
  name: string;
  package_days: number;
  start_date: string; // Format: YYYY-MM-DD
  usage_limit_GB: number;
  uuid: string;
};

export type Option = {
  value: string;
  label: string;
};
