import { Stripe } from "stripe";

import { STRIPE_SECRET_KEY } from "../config/server";

const STRIPE_API_VERSION = "2026-02-25.clover";

// Stripe
export const stripe = new Stripe(STRIPE_SECRET_KEY || "default", {
  apiVersion: STRIPE_API_VERSION,
  maxNetworkRetries: 3,
  timeout: 5000,
});
