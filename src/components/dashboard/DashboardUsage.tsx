import { Edit, RefreshCcw } from "lucide-react";
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

interface Props {}

function DashboardOverview(_props: Props) {
  const { data, mutate } = useSWR("fetchUsage", fetchUsage, { errorRetryCount: 10, errorRetryInterval: 2000 });

  const user = data?.user;
  const usage = data?.usage;
  const currentPlan = user?.profile?.subscriptionType;
  const currentUsed = usage?.current_usage_GB ?? 0;
  const totalAllowed = usage?.usage_limit_GB ?? 0;
  const percentUsed = currentUsed / totalAllowed * 100;
  const date = usage?.last_online && new Date(usage.last_online).toLocaleDateString("us", { dateStyle: "medium" });
  const time = usage?.last_online && new Date(usage.last_online).toLocaleTimeString();
  const lastConnected = usage?.last_online && !usage.last_online.startsWith("000") ? `${date} - ${time}` : "Never";
  const { daysLeft } = getDaysLeft(usage?.start_date, usage?.mode, usage?.package_days);

  const resetMode = usage?.mode === "monthly" ? "data resets" : currentPlan === "trial" ? "trial ends" : "plan ends";
  const serviceStatus = usage?.enable && daysLeft > 0
    ? <span className="text-green-500">Active</span>
    : <span className="text-red-500">Inactive</span>;

  // Handlers
  const onClickRefresh = () => {
    // @ts-expect-error
    mutate(null);
  };

  // Markup
  const details = [
    {
      title: "Total data used",
      value: `${currentUsed.toFixed(2)} GB of ${totalAllowed} GB`,
    },
    {
      title: "Current cycle",
      value: `${daysLeft} days left until ${resetMode}`,
    },
    {
      title: "Last connected to VPN",
      value: lastConnected,
    },
    {
      title: "Account status",
      value: serviceStatus,
    },
  ];

  return (
    <Card x-chunk="Dashboard usage">
      <CardHeader className="flex flex-row items-center content-center gap-2 align-middle justify-between">
        <CardTitle>Data usage</CardTitle>
        <Button variant="link" onClick={onClickRefresh} className="px-0">
          <RefreshCcw />
          <span>Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Progress value={percentUsed} className="bg-transparent border border-border" />
        <div className="flex flex-row items-center content-center justify-between py-1 pb-2 align-middle">
          <span className="text-sm text-muted-foreground">
            0
          </span>
          <span className="text-sm text-muted-foreground">
            {totalAllowed}
            {" "}
            GB
          </span>
        </div>

        <div className="flex flex-col gap-6 pt-6">
          {details.map(({ title, value }, index) => (
            <div className="flex flex-col justify-start gap-1" key={index}>
              <h1 className="text-lg font-semibold">{title}</h1>
              <span className="text-muted-foreground">
                {user ? value : <Skeleton className="w-56 h-6" />}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pb-6">
        <a href="/dashboard/account">
          <Button variant="outline">
            <Edit />
            <span>Manage account</span>
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}

export default DashboardOverview;
