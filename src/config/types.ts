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
  enable: boolean;
  is_active: boolean; // Is user actively using VPN
  last_online: Date | null;
  mode: string;
  name: string;
  package_days: number;
  start_date: string; // Format: YYYY-MM-DD
  usage_limit_GB: number;
  uuid: string;
};
