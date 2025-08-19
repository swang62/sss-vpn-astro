/* eslint-disable perfectionist/sort-objects */
import type {
  HiddifyServer,
  HiddifyServerId,
  Platform,
  PricingPlan,
  SubscriptionType,
} from "./types";

import { SITE_URL } from "./client";

export const SITE_NAME = "SSS-VPN";
export const SITE_EMAIL = "hello@sss-vpn.com";
export const SITE_ADMIN = "admin@sss-vpn.com";
export const SITE_IMAGE = `${SITE_URL}/seo-image.jpg`;
export const SITE_ICON = `${SITE_URL}/favicon.ico`;
export const SITE_DESCRIPTION =
  "Steve's Super Secret VPN - Private and reliable custom VPN for accessing media in high censorship countries such as China, Iran, Russia. Connect unlimited devices, get started for free. Strict no-logs policy, using latest encryption protocols for obfuscation and firewall hopping.";

export const TEST_ADMIN = "test-admin@sss-vpn.com";
export const TEST_USER = "test-user@sss-vpn.com";
export const DEFAULT_PASSWORD = "password";

export const DATA_PACKAGE_PRICE = 2; // dollars
export const MAX_NAME_LENGTH = 20; // characters
export const MAX_BANDWIDTH = 6000; // GB
export const MIN_WAIT_TIME = 1; // minutes
export const TRIAL_TIME = 3; // days

//! Update stripe prices, tags, and customer portal
export const PLAN_LIMITS: Record<
  SubscriptionType,
  { data: number; price: number }
> = {
  none: {
    data: 0,
    price: 0,
  },
  trial: {
    data: 3,
    price: 0,
  },
  // PAID TIER
  basic: {
    data: 100,
    price: 4,
  },
  pro: {
    data: 300,
    price: 8,
  },
  premium: {
    data: 600,
    price: 12,
  },
  router: {
    data: 0,
    price: 60,
  },
};

export const FILE_DOWNLOAD_URL =
  "https://seafile.mildlybrewed.com/d/f7cef31aca9f488c9ff8/files/?dl=1&p=%2F";
export const FILE_TYPES: Record<Platform, { fileType: string; icon: string }> =
  {
    android: {
      fileType: "Hiddify.apk",
      icon: "/setup/google-play.png",
    },
    ios: {
      fileType: "Hiddify.ipa",
      icon: "/setup/ios.png",
    },
    pc: {
      fileType: "Hiddify.exe",
      icon: "/setup/microsoft.png",
    },
    mac: {
      fileType: "Hiddify.dmg",
      icon: "/setup/mac.png",
    },
  };

export const PRICING_PLANS: PricingPlan[] = [
  {
    description: "Should be enough data for most people",
    features: [
      `${PLAN_LIMITS.basic.data}GB data/month`,
      "Email, social media, light browsing",
      "Unlimited devices, mobile & desktop",
    ],
    plan: "basic",
    price: PLAN_LIMITS.basic.price,
  },
  {
    description: "Good for heavy streaming & media usage",
    features: [
      `${PLAN_LIMITS.pro.data}GB data/month`,
      "Streaming, gaming, video calls, etc.",
      "Same as basic but with more data",
    ],
    plan: "pro",
    price: PLAN_LIMITS.pro.price,
  },
  {
    description:
      "One device to connect multiple people or all your gadgets at once",
    features: [
      `${PLAN_LIMITS.premium.data}GB data/month`,
      "Fully pre-configured WiFi6 router",
      "Shipping only within China",
    ],
    plan: "premium",
    price: PLAN_LIMITS.premium.price,
  },
];

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
