import postmark from "postmark";
import { Stripe } from "stripe";

import {
  POSTMARK_TOKEN,
  STRIPE_SECRET_KEY,
} from "@/config/server";

//* Should only contain server-side clients/actions

// Stripe
export const stripe = new Stripe(STRIPE_SECRET_KEY || "test", {
  maxNetworkRetries: 3,
  timeout: 10 * 1000,
});

// Postmark
export const postmarkClient = POSTMARK_TOKEN
  ? new postmark.ServerClient(POSTMARK_TOKEN)
  : null;
