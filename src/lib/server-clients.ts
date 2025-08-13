import axios from "axios";
import postmark from "postmark";
import { Stripe } from "stripe";

import {
  HIDDIFY_API_KEY,
  POSTMARK_TOKEN,
  STRIPE_SECRET_KEY,
} from "@/config/server";

//* Should only contain server-side clients/actions

// Stripe
export const stripe = new Stripe(STRIPE_SECRET_KEY || "test", {
  apiVersion: "2025-07-30.basil",
  maxNetworkRetries: 3,
  timeout: 10 * 1000,
});

// Postmark
export const postmarkClient = POSTMARK_TOKEN
  ? new postmark.ServerClient(POSTMARK_TOKEN)
  : null;

// Hiddify
export const axiosHiddify = axios.create({ headers: {
  "accept": "application/json",
  "content-type": "application/json",
  "Hiddify-API-Key": HIDDIFY_API_KEY,
} });
