import axios from "axios";
import { useEffect, useState } from "react";

import { UPTIME_API_BADGE_URL } from "@/config/constants";

function ServerStatus() {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(UPTIME_API_BADGE_URL, {
        responseType: "text",
        signal: controller.signal,
      })
      .then((r) => setOnline(r.data.includes("Up")))
      .catch(() => setOnline(false));
    return () => controller.abort();
  }, []);

  if (online === null) {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 px-2.5 py-0.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/40" />
        <span className="font-medium font-mono text-[11px] text-muted-foreground tracking-wider">
          CHECKING
        </span>
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1.5 rounded-full border border-border/40 bg-muted/30 px-2.5 py-0.5">
      <span
        className={`h-1.5 w-1.5 rounded-full ${online ? "animate-pulse bg-green-500" : "bg-red-500"}`}
      />
      <span className="font-medium font-mono text-[11px] text-muted-foreground tracking-wider">
        {online ? "ONLINE" : "OFFLINE"}
      </span>
    </span>
  );
}

export default ServerStatus;
