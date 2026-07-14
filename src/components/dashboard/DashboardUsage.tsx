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
import { Progress } from "@/components/ui/progress";
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
  const percentUsed = (currentUsed / totalAllowed) * 100;
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
  const serviceStatus =
    usage?.enable && daysLeft > 0 ? (
      <span className="font-mono font-semibold text-green-500 text-xs uppercase tracking-wider">
        Active
      </span>
    ) : (
      <span className="font-mono font-semibold text-red-500 text-xs uppercase tracking-wider">
        Inactive
      </span>
    );

  const onClickRefresh = () => {
    mutate(undefined, { revalidate: true });
  };

  const details = [
    {
      title: "Total used",
      value: `${currentUsed.toFixed(1)} GB of ${totalAllowed} GB`,
    },
    {
      title: "Last connected",
      value: lastConnected,
    },
    {
      title: "Current cycle",
      value: `${daysLeft} days left until ${resetMode}`,
    },
    {
      title: "Account status",
      value: serviceStatus,
    },
  ];

  return (
    <Card x-chunk="Dashboard usage">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gauge className="size-5 text-primary" />
          <CardTitle className="translate-y-px font-heading">
            Data usage
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Progress
          value={percentUsed}
          className="border border-border bg-transparent [&>div]:bg-linear-to-r [&>div]:from-primary/80 [&>div]:to-secondary/60"
        />
        <div className="flex items-center justify-end py-1 pb-2">
          <span className="text-muted-foreground text-xs">
            {totalAllowed} GB
          </span>
        </div>

        <div className="flex flex-col gap-6 pt-8">
          {details.map(({ title, value }, index) => (
            <div className="flex flex-col gap-1.5" key={index}>
              <span className="text-muted-foreground text-sm">{title}</span>
              <span className="text-foreground">
                {user ? value : <Skeleton className="h-6 w-56" />}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row flex-wrap justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClickRefresh}
          className="gap-1.5"
        >
          <RefreshCcw className="size-3.5" />
          Refresh
        </Button>
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
