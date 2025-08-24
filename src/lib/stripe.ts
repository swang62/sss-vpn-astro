import { Stripe } from "stripe";

import { STRIPE_SECRET_KEY } from "../config/server";

const STRIPE_API_VERSION = "2025-07-30.basil";

// Stripe
export const stripe = new Stripe(STRIPE_SECRET_KEY || "default", {
  apiVersion: STRIPE_API_VERSION,
  maxNetworkRetries: 3,
  timeout: 3000,
});
