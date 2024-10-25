import { CircleDollarSign, Download, Home } from "lucide-react";

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
    label: "How to install",
  },
  {
    href: "/dashboard/plans",
    icon: <CircleDollarSign />,
    label: "Plans",
  },
];
