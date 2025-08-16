import axios from "axios";
import postmark from "postmark";
import { Stripe } from "stripe";

import { STRIPE_API_VERSION } from "@/config/constants";
import {
  HIDDIFY_API_KEY,
  POSTMARK_TOKEN,
  STRIPE_SECRET_KEY,
} from "@/config/server";

//* Should only contain server-side clients

// Stripe
export const stripe = new Stripe(STRIPE_SECRET_KEY || "test", {
  apiVersion: STRIPE_API_VERSION,
  maxNetworkRetries: 3,
  timeout: 5000,
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
}, timeout: 5000 });
