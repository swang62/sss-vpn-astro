import { DollarSign, Download, Home } from "lucide-react";

import type { PricingCardProps } from "@/components/PricingForm";

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
    href: "/dashboard/pricing",
    icon: <DollarSign />,
    label: "Purchase / Upgrade",
  },
];

export const PRICING_PLANS: PricingCardProps[] = [
  {
    description: "Should be enough data for most people",
    features: ["50GB data", "Email, messaging, music, blogs, light media usage", "Desktop & phone apps"],
    plan: "basic",
    price: 5,

  },
  {
    description: "Good for heavy streaming/media usage",
    features: ["150GB data", "Heavy streaming, gaming, video conferencing", "More data!"],
    plan: "pro",
    price: 10,
  },
  {
    description: "For multiple people, family members, or lots of IoT devices",
    features: [
      "300GB data",
      "Fully pre-configured WiFi6 router",
      "Remote support available",
      "Domestic shipping only*",
    ],
    plan: "premium",
    price: 20,
  },
];
