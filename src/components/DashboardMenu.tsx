import type { MenuLink } from "@/lib/types";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface Props {
  current: string;
  links: MenuLink[];
}

function DashboardMenu({ current, links }: Props) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="flex gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={navigationMenuTriggerStyle({
                className: cn(
                  "bg-transparent text-foreground/70 hover:bg-transparent hover:text-foreground focus:bg-transparent",
                  link.href === current
                    ? "font-semibold text-foreground underline underline-offset-8"
                    : null,
                ),
              })}
            >
              {link.label}
            </a>
          ))}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default DashboardMenu;
