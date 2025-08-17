import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { MAIN_LINKS } from "@/config/links";

interface Props {}

function MainDesktopMenu(_props: Props) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="flex gap-2">
          {MAIN_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={navigationMenuTriggerStyle({
                className:
                  "hover:text-muted-foreground bg-transparent hover:bg-transparent focus:bg-transparent",
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

export default MainDesktopMenu;
