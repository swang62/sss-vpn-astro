export type MainMenuLink = {
  href: string;
  label: string;
};

export type PricingCardProps = {
  title: "Basic" | "Pro" | "Premium";
  monthlyPrice: number;
  description: string;
  features: string[];
};
