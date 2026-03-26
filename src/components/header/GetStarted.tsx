import { navigate } from "astro:transitions/client";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

function GetStarted() {
  return (
    <Button
      onClick={() => navigate("/signup")}
      data-umami-event="get-started"
      className="group rounded-full"
      variant="secondary"
    >
      Get started for free
      <ArrowRight className="size-5 transition-all duration-200 group-hover:translate-x-1" />
    </Button>
  );
}

export default GetStarted;
