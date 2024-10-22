import type { $Infer } from "@/lib/auth-client";

export type Session = typeof $Infer.Session | null;
export type User = typeof $Infer.Session.user;

export type MainMenuLink = {
  href: string;
  label: string;
};

export type PricingCardProps = {
  plan: Subscription;
  monthlyPrice: number;
  description: string;
  features: string[];
};

export const subscriptions = [
  "none",
  "trial",
  "basic",
  "pro",
  "premium",
] as const;
export type Subscription = (typeof subscriptions)[number];

export const subscriptionPaid: Subscription[] = [
  "basic",
  "pro",
  "premium",
] as const;
