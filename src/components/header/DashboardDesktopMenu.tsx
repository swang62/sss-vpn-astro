import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { DASHBOARD_LINKS } from "@/config/links";
import { cn } from "@/lib/utils";

interface Props {
  current: string;
}

function DashboardDesktopMenu({ current }: Props) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="flex gap-2">
          {DASHBOARD_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={navigationMenuTriggerStyle({
                className: cn(
                  "bg-transparent text-foreground/70 hover:bg-transparent hover:text-foreground focus:bg-transparent",
                  link.href === current
                    ? "text-foreground underline underline-offset-8"
                    : null,
                ),
              })}
            >
              {link.label}
              {link.label === "Upgrade" && <span className="flex size-4 items-center ml-1">{link.icon}</span>}
            </a>
          ))}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default DashboardDesktopMenu;
