import { useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/server/client";

const getStatus = () => apiClient.status.$get().then((res) => res.json());

interface Props {}

function ApiStatus(_props: Props) {
  const [statusResponse, setStatusResponse] = useState("");
  const { mutate } = useSWR("/api/status", getStatus);

  // Handlers
  const onClickStatus = async () => {
    const data = await mutate();
    setStatusResponse(JSON.stringify(data, null, 2));
  };
  const onClickReset = () => {
    setStatusResponse("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClickStatus}>
            Check Status
          </Button>
        </div>
        <Button variant="destructive" onClick={onClickReset}>
          Reset All
        </Button>
      </div>
      {statusResponse && <code>{statusResponse}</code>}
    </div>
  );
}

export default ApiStatus;
