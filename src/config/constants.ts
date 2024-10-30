import type { SubscriptionType } from "./types";

export const SITE_NAME = "SSSVPN";
export const SITE_EMAIL = "hello@sss-vpn.com";
export const SITE_ADMIN = "admin@sss-vpn.com";

export const DB_LOCAL = "file:local.db";
export const DB_TEST = "file:test.db";
export const DB_SYNC_INTERVAL = 30;

// Data limits
export const TRIAL_DATA = 3;
export const BASIC_DATA = 50;
export const PRO_DATA = 150;
export const PREMIUM_DATA = 300;
export const PLAN_LIMITS: Record<SubscriptionType, number> = {
  basic: BASIC_DATA,
  none: 0,
  premium: PREMIUM_DATA,
  pro: PRO_DATA,
  trial: TRIAL_DATA,
};

// Time limits
export const TRIAL_TIME = 3;
