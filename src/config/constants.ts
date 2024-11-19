/* eslint-disable perfectionist/sort-objects */
import type { HiddifyServer, HiddifyServerId, SubscriptionType } from "./types";

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
    data: 50,
    price: 5,
  },
  pro: {
    data: 150,
    price: 10,
  },
  premium: {
    data: 300,
    price: 15,
  },
};

export const MAX_NAME_LENGTH = 20;
export const MAX_BANDWIDTH_GB = 6000;

export const HIDDIFY_DOWNLOAD_URL = "https://nextcloud.mildlybrewed.com/s/9kMknzTdRk4GjiB/download?files=";
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
