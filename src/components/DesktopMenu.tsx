import type { MainMenuLink } from "@/types";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

interface Props {
  links: MainMenuLink[];
}

export function DesktopMenu({ links }: Props) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={navigationMenuTriggerStyle()}
            >
              {link.label}
            </a>
          ))}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
