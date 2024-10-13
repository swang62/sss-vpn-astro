import { useCallback, useState } from "preact/hooks";
import { twMerge } from "tailwind-merge";

import { parsedApi } from "@/lib/utils";
import { apiClient } from "@/server/client";

interface Props {}

function Status(_props: Props) {
  const [status, setStatus] = useState("");

  const onClickStatus = useCallback(async () => {
    const { data, error } = await parsedApi(apiClient.status.$get());

    if (error) return;

    setStatus(JSON.stringify(data, null, 2));
  }, []);

  return (
    <div className="instructions flex flex-col gap-4">
      <div className="flex justify-between">
        <button
          onClick={onClickStatus}
          className={twMerge("btn", "bg-green-800 hover:bg-green-600")}
        >
          Check API
        </button>
        <button
          onClick={() => setStatus("")}
          className={twMerge("btn", "bg-red-800 hover:bg-red-600")}
        >
          Reset
        </button>
      </div>
      <code>{status}</code>
    </div>
  );
}

export default Status;
