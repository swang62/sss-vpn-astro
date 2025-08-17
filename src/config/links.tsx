import { Download, Home, Lightbulb, Rocket } from "lucide-react";

export type MenuLink = {
  href: string;
  label: string;
  icon?: React.JSX.Element;
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
    icon: <Rocket />,
    label: "Upgrade Plan",
  },
];
