import { Sidebar } from "lucide-react";
import { useState } from "react";

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
import { DASHBOARD_LINKS } from "@/config/links";
import { cn } from "@/lib/utils";

interface Props {
  pathname: string;
}

function DashboardMobileMenu({ pathname }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" size="icon" className="shrink-0 gap-0 p-0">
          <Sidebar />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader className="py-4 pl-4">
          <a href="/#top" onClick={() => setOpen(false)}>
            <SheetTitle className="flex flex-nowrap items-center gap-2 text-left">
              <img
                src="/favicon.ico"
                alt="logo"
                width={36}
                height={36}
                className="shrink-0"
              />
              <span className="translate-y-px font-heading text-3xl leading-none">
                {SITE_NAME}
              </span>
            </SheetTitle>
          </a>
          <SheetDescription className="sr-only">Main menu</SheetDescription>
        </SheetHeader>

        <div className="my-2 h-[calc(100vh-8rem)] w-full py-2">
          <div className="flex flex-col gap-1 px-3">
            {DASHBOARD_LINKS.map(
              (link) =>
                link.href && (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant={link.href === pathname ? "secondary" : "ghost"}
                      className={cn("flex w-full justify-start gap-3")}
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Button>
                  </a>
                )
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DashboardMobileMenu;
