import { navigate } from "astro:transitions/client";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

function GetStarted() {
  return (
    <Button
      onClick={() => navigate("/signup")}
      data-umami-event="get-started"
      className="group rounded-full hover:shadow-[0_0_12px] hover:shadow-primary/30"
      variant="default"
    >
      Get started
      <ArrowRight className="size-5 transition-all duration-300 group-hover:translate-x-1" />
    </Button>
  );
}

export default GetStarted;
