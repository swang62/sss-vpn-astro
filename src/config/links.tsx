import { CircleDollarSign, Download, Home, Lightbulb } from "lucide-react";

import type { PricingCardProps } from "@/components/PricingPlans";

import { BASIC_DATA, PREMIUM_DATA, PRO_DATA } from "./constants";

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
    features: [`${BASIC_DATA}GB data`, "Email, social media, light browsing", "Unlimited devices, mobile & desktop apps"],
    plan: "basic",
    price: 5,

  },
  {
    description: "Good for heavy streaming/media usage",
    features: [`${PRO_DATA}GB data`, "Heavy media streaming, gaming, video conferencing, etc.", "Same as basic but more data"],
    plan: "pro",
    price: 10,
  },
  {
    description: "One device to connect multiple people or all your gadgets at once",
    features: [
      `${PREMIUM_DATA}GB data`,
      "Fully pre-configured WiFi router",
      "Shipping only within China",
    ],
    plan: "premium",
    price: 15,
  },
];
