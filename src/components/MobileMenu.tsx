import { GlobeLock, Menu } from "lucide-react";
import * as React from "react";

import type { MainMenuLink } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SITE_NAME } from "@/config/constants";

interface Props {
  links: MainMenuLink[];
}
export function MobileMenu({ links }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="mr-2 h-8 w-8 px-1.5 md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 text-xl">
        <SheetHeader className="pl-4 pt-4">
          <SheetTitle className="flex flex-nowrap items-center gap-2 text-left text-2xl font-bold">
            <GlobeLock />
            <span>{SITE_NAME}</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Main menu</SheetDescription>
        </SheetHeader>

        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-10">
          <div className="flex flex-col space-y-3">
            {links.map(
              (link) =>
                link.href && (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground"
                    onClick={() =>
                      link.href.startsWith("#") ? setOpen(false) : undefined
                    }
                  >
                    {link.label}
                  </a>
                ),
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
