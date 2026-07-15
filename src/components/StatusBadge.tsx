import useSWR from "swr";
import { fetchLocation } from "@/lib/api-clients";

function StatusBadge() {
  const { data } = useSWR("location", fetchLocation);
  const ip = data?.ip;
  const label = ip || "0.0.0.0";

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 backdrop-blur-md">
      <span className="size-2 animate-pulse rounded-full bg-destructive" />
      <span className="font-mono text-muted-foreground text-xs tracking-widest">
        {label} · UNPROTECTED
      </span>
    </div>
  );
}

export default StatusBadge;
