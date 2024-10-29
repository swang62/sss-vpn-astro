import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchUsage } from "@/lib/api-clients";

import { Skeleton } from "./ui/skeleton";

interface Props {}

function DashboardData(_props: Props) {
  const [progress, setProgress] = useState(0);
  const { mutate } = useSWRConfig();
  const { data } = useSWR("fetchUsage", fetchUsage);
  const hiddify = data?.hiddify;
  const currentUsed = hiddify?.current_usage_GB ?? 1;
  const totalAllowed = hiddify?.usage_limit_GB ?? 1;
  const usage = currentUsed / totalAllowed * 100;

  const onClickRefresh = async () => {
    await mutate("fetchUsage", {});
  };

  useEffect(() => {
    setProgress(usage + 1);
  }, [usage]);

  const details = [
    {
      title: "Data used so far",
      value: `${currentUsed.toFixed(3)} GB`,
    },
    {
      title: "Data left",
      value: `${(totalAllowed - currentUsed).toFixed(3)} GB`,
    },
  ];

  return (
    <Card x-chunk="Dashboard usage">
      <CardHeader className="flex flex-row items-center justify-between align-middle content-center pt-4">
        <CardTitle>Data usage</CardTitle>
        <Button variant="outline" onClick={onClickRefresh} className="m-0">
          <Edit />
          <span>Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="bg-transparent border-border border" />
        <div className="flex flex-row items-center justify-between align-middle content-center py-1">
          <span className="text-xs text-muted-foreground">
            0 B
          </span>
          <span className="text-xs text-muted-foreground">
            {totalAllowed.toFixed(0)}
            {" "}
            GB
          </span>
        </div>
        <div className="flex flex-col gap-6 pt-6">
          {details.map(({ title, value }, index) => (
            <div className="flex flex-col justify-start" key={index}>
              <h1 className="text-xl font-semibold">{title}</h1>
              <span className="text-lg text-muted-foreground">
                {hiddify ? value : <Skeleton className="w-56 h-6 mt-1" />}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default DashboardData;
