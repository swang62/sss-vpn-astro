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
  current: string;
}

function DashboardMobileMenu({ current: _current }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="gap-0 p-0 shrink-0 md:hidden"
        >
          <Sidebar />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader className="py-4 pl-4">
          <a href="/#top" onClick={() => setOpen(false)}>
            <SheetTitle className="flex items-center gap-2 text-3xl font-semibold text-left flex-nowrap">
              <img src="/favicon.ico" alt="logo" width={36} height={36} />
              <span>{SITE_NAME}</span>
            </SheetTitle>
          </a>
          <SheetDescription className="sr-only">Main menu</SheetDescription>
        </SheetHeader>

        <SheetHeader>
          <SheetTitle className="pl-4 mt-6 mb-0 text-sm text-left text-muted-foreground">
            Dashboard
          </SheetTitle>
          <SheetDescription className="sr-only">Dashboard</SheetDescription>
        </SheetHeader>

        <div className="my-2 h-[calc(100vh-8rem)] w-full py-2">
          <div className="flex flex-col space-y-2">
            {DASHBOARD_LINKS.map(
              link =>
                link.href && (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "m-0 flex h-6 w-11/12 justify-start gap-4 py-6 text-xl",
                      )}
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </Button>
                  </a>
                ),
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default DashboardMobileMenu;
