import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { DASHBOARD_LINKS } from "@/config/links";
import { cn } from "@/lib/utils";

interface Props {
  pathname: string;
}

function DashboardDesktopMenu({ pathname }: Props) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="flex gap-1">
          {DASHBOARD_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={navigationMenuTriggerStyle({
                className: cn(
                  "bg-transparent text-foreground/60 hover:bg-transparent hover:text-foreground focus:bg-transparent",
                  link.href === pathname
                    ? "text-foreground underline decoration-primary underline-offset-8"
                    : null
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

export default DashboardDesktopMenu;
