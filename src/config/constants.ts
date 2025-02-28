/* eslint-disable perfectionist/sort-objects */
import type { HiddifyServer, HiddifyServerId, PaidPlan, SubscriptionType } from "./types";

export const SITE_NAME = "SSSVPN";

export const SITE_EMAIL = "hello@sss-vpn.com";
export const SITE_EMAIL_ADMIN = "admin@sss-vpn.com";
export const TEST_EMAIL = "test@sss-vpn.com";

export const DB_LOCAL = "file:local.db";
export const DB_TEST = "file:test.db";
export const DB_SYNC_INTERVAL = 30;

export const DATA_PACKAGE_PRICE = 2; // dollars

export const TRIAL_TIME = 3;

// When changing these, make sure to update stripe products, tags, and customer portal
export const PLAN_LIMITS: Record<SubscriptionType, { data: number; price: number }> = {
  none: {
    data: 0,
    price: 0,
  },
  trial: {
    data: 3,
    price: 0,
  },
  // Paid tiers
  basic: {
    data: 100,
    price: 5,
  },
  pro: {
    data: 300,
    price: 10,
  },
  premium: {
    data: 600,
    price: 15,
  },
};

export type PricingPlan = {
  plan: PaidPlan;
  price: number;
  description: string;
  features: string[];
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    description: "Should be enough data for most people",
    features: [`${PLAN_LIMITS.basic.data}GB of data/month`, "Email, social media, light browsing", "Unlimited devices, mobile & desktop"],
    plan: "basic",
    price: PLAN_LIMITS.basic.price,

  },
  {
    description: "Good for heavy streaming & media usage",
    features: [`${PLAN_LIMITS.pro.data}GB of data/month`, "Streaming, gaming, video calls, etc.", "Same as basic but with more data"],
    plan: "pro",
    price: PLAN_LIMITS.pro.price,
  },
  {
    description: "One device to connect multiple people or all your gadgets at once",
    features: [
      `${PLAN_LIMITS.premium.data}GB of data/month`,
      "Fully pre-configured WiFi6 router",
      "Shipping only within China",
    ],
    plan: "premium",
    price: PLAN_LIMITS.premium.price,
  },
];

export const MAX_NAME_LENGTH = 20;
export const MAX_BANDWIDTH_GB = 6000;

export const HIDDIFY_DOWNLOAD_URL = "https://seafile.mildlybrewed.com/d/f7cef31aca9f488c9ff8/files/?dl=1&p=%2F";
export const HIDDIFY_SERVERS: Record<HiddifyServerId, HiddifyServer> = {
  1: {
    baseUrl: "https://link.sss-vpn.com/QwId8HABKn9c6GYrnRNcxMj/api/v2",
    ip: "74.48.133.118",
    setupLink: "https://link.sss-vpn.com/rjsn7TPtBHgNGA1KBI3mfP2aNaLG",
  },
  2: {
    baseUrl: "https://link2.sss-vpn.com/Y6bLeWbTns/api/v2",
    ip: "148.135.10.52",
    setupLink: "https://link2.sss-vpn.com/iJ6hLqtNNtOmt6ciLm2Ry",
  },
};
