import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/server/client";

const getStatus = () => apiClient.status.$get().then((res) => res.json());

interface Props {}

function ApiStatus(_props: Props) {
  const [statusResponse, setStatusResponse] = useState("");
  const { error, mutate } = useSWR("/api/status", getStatus);

  // Handlers
  const onClickStatus = async () => {
    const data = await mutate();
    toast("Fetched.");
    setStatusResponse(JSON.stringify(data, null, 2));
  };
  const onClickReset = () => {
    setStatusResponse("");
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClickStatus}>
            Check API Status
          </Button>
          <a href="/debug-user">
            <Button variant="link">Search Users</Button>
          </a>
        </div>
        <Button variant="destructive" onClick={onClickReset}>
          Reset All
        </Button>
      </div>
      <code>{statusResponse || (error ? error.message : null)}</code>
    </div>
  );
}

export default ApiStatus;
