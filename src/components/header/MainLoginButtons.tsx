import { Button } from "@/components/ui/button";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

function MainLoginButtons() {
  return (
    <span className="flex items-center gap-x-4">
      <a
        href="/login"
        className={navigationMenuTriggerStyle({
          className:
            "hover:text-muted-foreground bg-transparent pr-2 pl-2 hover:bg-transparent focus:bg-transparent",
        })}
      >
        Log in
      </a>
      <a href="/signup">
        <Button className="rounded-full" data-umami-event="get-started">
          Get started
        </Button>
      </a>
    </span>
  );
}

export default MainLoginButtons;
