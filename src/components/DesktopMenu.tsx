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
        <NavigationMenuItem className="flex gap-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={navigationMenuTriggerStyle({
                className:
                  "bg-transparent hover:bg-transparent hover:text-muted-foreground focus:bg-transparent",
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
