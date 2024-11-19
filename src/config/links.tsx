import { CircleDollarSign, Download, Home, Lightbulb } from "lucide-react";

import type { PricingCardProps } from "@/components/PricingPlans";

import { PLAN_LIMITS } from "./constants";

export type MenuLink = {
  href: string;
  label: string;
  icon?: JSX.Element;
};

export const MAIN_LINKS: MenuLink[] = [
  {
    href: "/#about",
    label: "About",
  },
  {
    href: "/#features",
    label: "Features",
  },
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#faqs",
    label: "FAQs",
  },
];

export const DASHBOARD_LINKS: MenuLink[] = [
  {
    href: "/dashboard",
    icon: <Home />,
    label: "Overview",
  },
  {
    href: "/dashboard/install",
    icon: <Download />,
    label: "Install VPN",
  },
  {
    href: "/dashboard/tips",
    icon: <Lightbulb />,
    label: "Tips & Tricks",
  },
  {
    href: "/dashboard/pricing",
    icon: <CircleDollarSign />,
    label: "Upgrade",
  },
];

export const PRICING_PLANS: PricingCardProps[] = [
  {
    description: "Should be enough data for most people",
    features: [`${PLAN_LIMITS.basic.data}GB data`, "Email, social media, light browsing", "Unlimited devices, mobile & desktop apps"],
    plan: "basic",
    price: PLAN_LIMITS.basic.price,

  },
  {
    description: "Good for heavy streaming/media usage",
    features: [`${PLAN_LIMITS.pro.data}GB data`, "Video streaming, gaming, video conferencing, etc.", "Same as basic but more data"],
    plan: "pro",
    price: PLAN_LIMITS.pro.price,
  },
  {
    description: "One device to connect multiple people or all your gadgets at once",
    features: [
      `${PLAN_LIMITS.premium.data}GB data`,
      "Fully pre-configured WiFi router",
      "Shipping only within China",
    ],
    plan: "premium",
    price: PLAN_LIMITS.premium.price,
  },
];
