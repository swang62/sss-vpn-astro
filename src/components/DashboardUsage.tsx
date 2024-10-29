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
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUsage } from "@/lib/api-clients";
import { getDaysLeft } from "@/lib/utils";

import { Progress } from "./ui/progress";

interface Props {}

function DashboardOverview(_props: Props) {
  const { data, mutate } = useSWR("fetchUsage", fetchUsage);
  const user = data?.user;
  const hiddify = data?.hiddify;
  const currentUsed = hiddify?.current_usage_GB ?? 0;
  const totalAllowed = hiddify?.usage_limit_GB ?? 0;
  const usage = currentUsed / totalAllowed * 100;
  const date = hiddify?.last_online && new Date(hiddify.last_online).toLocaleDateString("us", { dateStyle: "medium" });
  const time = hiddify?.last_online && new Date(hiddify.last_online).toLocaleTimeString();
  const lastConnected = hiddify?.last_online ? `${date} - ${time}` : "";

  const { daysLeft, endDate } = getDaysLeft(hiddify?.start_date, hiddify?.mode, hiddify?.package_days);
  const resetMode = hiddify?.mode === "no_reset" ? "end" : "reset";
  const serviceStatus = hiddify?.enable
    ? <span className="text-green-500">Active</span>
    : <span className="text-red-500">Inactive</span>;

  // Handlers
  const onClickRefresh = async () => {
    // @ts-expect-error
    await mutate(null);
  };

  // Markup
  const details = [
    {
      title: "Usage",
      value: `${currentUsed.toFixed(2)} GB of ${totalAllowed} GB`,
    },
    {
      title: "Billing cycle",
      value: `Will ${resetMode} on ${endDate} (${daysLeft} days left)`,
    },
    {
      title: "Last connected to VPN",
      value: lastConnected,
    },
    {
      title: "Status",
      value: serviceStatus,
    },
  ];

  return (
    <Card x-chunk="Dashboard usage">
      <CardHeader className="flex flex-row items-center content-center gap-2 pt-4 align-middle">
        <CardTitle>Data</CardTitle>
        <Button variant="link" onClick={onClickRefresh}>
          <RefreshCcw />
          <span>Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Progress value={usage} className="bg-transparent border border-border" />
        <div className="flex flex-row items-center content-center justify-between py-1 pb-2 align-middle">
          <span className="text-sm text-muted-foreground">
            0
          </span>
          <span className="text-sm text-muted-foreground">
            {totalAllowed.toFixed(0)}
            {" "}
            GB
          </span>
        </div>

        <div className="flex flex-col gap-6 pt-6">
          {details.map(({ title, value }, index) => (
            <div className="flex flex-col justify-start gap-1" key={index}>
              <h1 className="text-lg font-semibold">{title}</h1>
              <span className="text-base text-muted-foreground">
                {user ? value : <Skeleton className="w-56 h-6" />}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
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
