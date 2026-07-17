import androidIcon from "@/assets/setup/google-play.png";
import iosIcon from "@/assets/setup/ios.png";
import macIcon from "@/assets/setup/mac.png";
import microsoftIcon from "@/assets/setup/microsoft.png";
import { SITE_URL } from "./client";
import type {
  HiddifyServer,
  Platform,
  PricingPlan,
  SubscriptionType,
} from "./types";

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
export const MIN_WAIT_TIME = 10; // seconds
export const TRIAL_TIME = 3; // days

export const FILE_START_COMMAND = "start_vpn.command";

// External URLs
export const GITHUB_URL = "https://github.com/swang62";
export const STRIPE_URL = "https://stripe.com/";
export const UMAMI_SCRIPT_URL = "https://umami.stronglybrewed.dev/script.js";
export const UPTIME_BASE_URL = "https://uptime.stronglybrewed.dev";
export const UPTIME_STATUS_URL = `${UPTIME_BASE_URL}/status/sssvpn`;
export const UPTIME_API_BADGE_URL = `${UPTIME_BASE_URL}/api/badge/8/status`;

// App store & support links
export const APPLE_CONFIGURATOR_URL =
  "https://support.apple.com/apple-configurator";
export const APPLE_SUPPORT_REGION = "https://support.apple.com/zh-cn/118283";
export const XCODE_URL = "https://developer.apple.com/xcode/";
export const APP_STORE_HIDDIFY =
  "https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532";
export const APP_STORE_SHADOWROCKET =
  "https://apps.apple.com/cn/app/shadowrocket-%E5%B0%8F%E7%81%AB%E7%AE%ADvpn%E5%AE%89%E5%85%A8%E7%BD%91%E7%BB%9C%E5%8A%A0%E9%80%9F%E5%99%A8/id6742070311";
export const PLAY_STORE_HIDDIFY =
  "https://play.google.com/store/apps/details?id=app.hiddify.com&hl=en-us";
export const FILE_DOWNLOAD_URL =
  "https://seafile.stronglybrewed.dev/d/6d2ee2bc7a34472ca633/files/?dl=1&p=%2F";
export const HIDDIFY_SERVERS: HiddifyServer = {
  baseUrl: "https://link.sss-vpn.com/QwId8HABKn9c6GYrnRNcxMj/api/v2",
  setupLink: "https://link.sss-vpn.com/rjsn7TPtBHgNGA1KBI3mfP2aNaLG",
};

//! Update stripe prices, add new prices, archive/delete old keys
//! Update customer portal available subscriptions
export const PLAN_LIMITS: Record<
  SubscriptionType,
  { data: number; price: number }
> = {
  basic: {
    data: 100,
    price: 4,
  },
  none: {
    data: 0,
    price: 0,
  },
  premium: {
    data: 600,
    price: 12,
  },
  pro: {
    data: 300,
    price: 8,
  },
  router: {
    data: 0,
    price: 30,
  },
  trial: {
    data: 3,
    price: 0,
  },
};

export const FILE_TYPES: Record<Platform, { fileType: string; icon: string }> =
  {
    android: {
      fileType: "Hiddify.apk",
      icon: androidIcon.src,
    },
    ios: {
      fileType: "Hiddify.ipa",
      icon: iosIcon.src,
    },
    mac: {
      fileType: "Hiddify.dmg",
      icon: macIcon.src,
    },
    pc: {
      fileType: "Hiddify.exe",
      icon: microsoftIcon.src,
    },
  };

export const PRICING_PLANS: PricingPlan[] = [
  {
    description: "Should be enough data for most people",
    features: [
      `${PLAN_LIMITS.basic.data}GB data/month`,
      "Email, social media, light browsing",
      "Unlimited devices",
    ],
    plan: "basic",
    price: PLAN_LIMITS.basic.price,
  },
  {
    description: "Good for heavy streaming & media usage",
    features: [
      `${PLAN_LIMITS.pro.data}GB data/month`,
      "Streaming, gaming, video calls, etc.",
      "Same as basic but more data",
    ],
    plan: "pro",
    price: PLAN_LIMITS.pro.price,
  },
  {
    description:
      "One device to connect multiple people and all your gadgets at once",
    features: [
      `${PLAN_LIMITS.premium.data}GB data/month`,
      "Fully pre-configured WiFi6 router",
      "Shipping only within China",
    ],
    plan: "premium",
    price: PLAN_LIMITS.premium.price,
  },
];
