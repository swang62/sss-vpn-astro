import { Edit, Gauge, RefreshCcw } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUsage } from "@/lib/api-clients";
import { getDaysLeft } from "@/lib/utils";

function DashboardOverview() {
  const { data, mutate } = useSWR("fetchUsage", fetchUsage, {
    errorRetryCount: 10,
    errorRetryInterval: 2000,
  });

  const user = data?.user;
  const usage = data?.usage;
  const currentPlan = user?.profile?.subscriptionType;
  const currentUsed = usage?.current_usage_GB ?? 0;
  const totalAllowed = usage?.usage_limit_GB ?? 0;
  const percentUsed = totalAllowed > 0 ? (currentUsed / totalAllowed) * 100 : 0;
  const date =
    usage?.last_online &&
    new Date(usage.last_online).toLocaleDateString("us", {
      dateStyle: "medium",
    });
  const time =
    usage?.last_online && new Date(usage.last_online).toLocaleTimeString();
  const lastConnected =
    usage?.last_online && !usage.last_online.startsWith("000")
      ? `${date} - ${time}`
      : "Never";
  const { daysLeft } = getDaysLeft(
    usage?.start_date,
    usage?.mode,
    usage?.package_days
  );

  const resetMode =
    usage?.mode === "monthly"
      ? "plan resets"
      : currentPlan === "trial"
        ? "trial ends"
        : "plan ends";
  const isOnline = usage?.enable && daysLeft > 0;

  const onClickRefresh = () => {
    mutate(undefined, { revalidate: true });
  };

  const loading = !user;

  return (
    <Card x-chunk="Dashboard usage">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gauge className="size-5 text-primary" />
          <CardTitle className="translate-y-px font-heading">
            Data usage
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClickRefresh}
            className="ml-auto size-7 text-primary/80 hover:text-primary"
          >
            <RefreshCcw className="size-3.5" />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          {loading ? (
            <Skeleton className="h-6 w-full rounded-full" />
          ) : (
            <div className="relative h-5 w-full overflow-hidden rounded-full border border-border/60 bg-muted/50 shadow-xs">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary/90 to-secondary/70 transition-all duration-700 ease-out"
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
          )}
          <div className="flex items-center justify-end">
            {loading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="font-mono font-semibold text-base text-foreground tabular-nums tracking-tight">
                {currentUsed.toFixed(1)}
                <span className="font-normal text-muted-foreground text-xs">
                  {" / "}
                  {totalAllowed} GB
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/20 p-3">
            <span className="text-muted-foreground text-xs">Billing cycle</span>
            {loading ? (
              <Skeleton className="h-5 w-20" />
            ) : (
              <span className="font-medium text-sm leading-tight">
                {daysLeft} days until {resetMode}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-border/40 bg-muted/20 p-3">
            <span className="text-muted-foreground text-xs">
              Last connected
            </span>
            {loading ? (
              <Skeleton className="h-5 w-28" />
            ) : (
              <span className="font-medium text-sm leading-tight">
                {lastConnected}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3">
          {loading ? (
            <>
              <Skeleton className="h-2.5 w-2.5 shrink-0 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </>
          ) : (
            <>
              <div
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${isOnline ? "animate-pulse bg-green-500" : "bg-red-500"}`}
              />
              <div className="flex flex-1 items-center justify-between">
                <span className="text-muted-foreground text-xs">
                  Account status
                </span>
                <span className="font-mono font-semibold text-xs uppercase tracking-wider">
                  {isOnline ? (
                    <span className="text-green-500">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
                </span>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <a href="/dashboard/account">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Edit className="size-3.5" />
            Manage Account
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}

export default DashboardOverview;
