import { Menu } from "lucide-react";
import { useState } from "react";
import logoSrc from "@/assets/logo.png";
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
import { MAIN_LINKS } from "@/config/links";

function MainMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="mr-2 h-8 w-8 px-1.5">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 text-xl">
        <SheetHeader className="pt-4 pl-4">
          <a href="/#top" onClick={() => setOpen(false)}>
            <SheetTitle className="flex flex-nowrap items-center gap-2 text-left font-semibold text-3xl">
              <img src={logoSrc.src} alt="logo" width={36} height={36} />
              <span>{SITE_NAME}</span>
            </SheetTitle>
          </a>
          <SheetDescription className="sr-only">Main menu</SheetDescription>
        </SheetHeader>

        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-10 text-2xl">
          <div className="flex flex-col space-y-6">
            {MAIN_LINKS.map(
              (link) =>
                link.href && (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                )
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MainMobileMenu;
