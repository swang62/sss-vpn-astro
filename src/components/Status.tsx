import { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

import { parsedApi } from "@/lib/utils";
import { apiClient } from "@/server/client";

import styles from "./Status.module.css";

interface Props {}

function Status(_props: Props) {
  const [status, setStatus] = useState("");

  const onClickStatus = useCallback(async () => {
    const { data } = await parsedApi(apiClient.status.$get());
    setStatus(JSON.stringify(data, null, 2));
  }, []);

  return (
    <div className="flex flex-col gap-4 instructions">
      <div className="flex justify-between">
        <button
          onClick={onClickStatus}
          className={twMerge(styles.button, "bg-green-800 hover:bg-green-600")}
        >
          Check API
        </button>
        <button
          onClick={() => setStatus("")}
          className={twMerge(styles.button, "bg-red-500 hover:bg-red-600")}
        >
          Reset
        </button>
      </div>
      <code>{status}</code>
    </div>
  );
}

export default Status;
