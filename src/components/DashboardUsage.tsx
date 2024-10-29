import { Edit } from "lucide-react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUsage } from "@/lib/api-clients";
import { getDaysLeft } from "@/lib/utils";

interface Props {}

function DashboardOverview(_props: Props) {
  const { data } = useSWR("fetchUsage", fetchUsage);
  const user = data?.user;
  const hiddify = data?.hiddify;

  const currentUsed = hiddify?.current_usage_GB.toFixed(2) ?? 0;
  const totalAllowed = hiddify?.usage_limit_GB.toFixed(0) ?? 0;
  const daysLeft = hiddify ? getDaysLeft(hiddify.start_date, hiddify.mode, hiddify.package_days) : 0;
  const resetMode = hiddify?.mode === "no_reset" ? "end" : "reset";
  const serviceStatus = hiddify?.enable ? <span className="text-green-500">Enabled</span> : <span className="text-red-500">Disabled</span>;

  console.debug(hiddify);

  const usage = [
    {
      title: "Data used",
      value: `${currentUsed} GB out of ${totalAllowed} GB`,
    },
    {
      title: "Usage cycle",
      value: `Data will ${resetMode} in ${daysLeft} days`,
    },
    {
      title: "Last connected",
      value: "today",
    },
    {
      title: "Status",
      value: serviceStatus,
    },
  ];

  return (
    <Card x-chunk="Dashboard usage">
      <CardContent className="flex flex-col gap-6 py-6">
        {usage.map(({ title, value }, index) => (
          <div className="flex flex-col justify-start" key={index}>
            <h1 className="text-xl font-semibold">{title}</h1>
            <span className="text-lg text-muted-foreground">
              {user ? value : <Skeleton className="w-56 h-6 mt-1" />}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-end gap-4 py-4">
        {user
          ? (
              <a href="/dashboard/account">
                <Button variant="outline">
                  <Edit />
                  <span>Manage account</span>
                </Button>
              </a>
            )
          : <Skeleton className="w-40 h-10" />}
      </CardFooter>
    </Card>
  );
}

export default DashboardOverview;
