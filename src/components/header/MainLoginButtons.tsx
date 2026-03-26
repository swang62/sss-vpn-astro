import { navigate } from "astro:transitions/client";

import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

function MainLoginButtons() {
  return (
    <span className="flex items-center gap-x-4">
      <a
        href="/login"
        data-astro-reload
        className={navigationMenuTriggerStyle({
          className:
            "hover:text-muted-foreground bg-transparent pr-2 pl-2 hover:bg-transparent focus:bg-transparent",
        })}
      >
        Log in
      </a>

      <Button
        onClick={() => navigate("/signup")}
        data-umami-event="get-started"
        className="rounded-full"
      >
        Get started
      </Button>
    </span>
  );
}

export default MainLoginButtons;
