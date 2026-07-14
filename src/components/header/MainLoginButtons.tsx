import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

import GetStarted from "./GetStarted";

function MainLoginButtons() {
  return (
    <span className="flex items-center gap-x-4">
      <a
        href="/login"
        data-astro-reload
        className={navigationMenuTriggerStyle({
          className:
            "bg-transparent pr-2 pl-2 hover:bg-transparent hover:text-muted-foreground focus:bg-transparent",
        })}
      >
        Log in
      </a>

      <GetStarted />
    </span>
  );
}

export default MainLoginButtons;
