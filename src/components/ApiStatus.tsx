import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/clients";

const getStatus = () => apiClient.status.$get().then((res) => res.json());
const getUser = () => apiClient.user.$get().then((res) => res.json());

interface Props {}

function ApiStatus(_props: Props) {
  const [code, setCode] = useState("");
  const { mutate } = useSWR("/api/status", getStatus);
  const { mutate: mutateUser } = useSWR("/api/user", getUser);

  // Handlers
  const onClickStatus = async () => {
    const data = await mutate();
    // @ts-expect-error
    if (!data?.message) toast.success("Fetched.");
    setCode(JSON.stringify(data, null, 2));
  };
  const onClickUser = async () => {
    const data = await mutateUser();
    // @ts-expect-error
    if (!data?.message) toast.success("Fetched user.");
    setCode(JSON.stringify(data, null, 2));
  };
  const onClickReset = () => {
    toast.info("Reset.");
    setCode("");
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 py-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClickStatus}>
            Check API status
          </Button>
          <Button variant="secondary" onClick={onClickUser}>
            Get current user
          </Button>
        </div>
        <Button variant="destructive" onClick={onClickReset}>
          Reset
        </Button>
      </div>
      <code>{code}</code>
    </div>
  );
}

export default ApiStatus;
