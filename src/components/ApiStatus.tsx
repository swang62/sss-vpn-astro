import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { fetchStatus, fetchUser } from "@/lib/api-clients";

interface Props {}

function ApiStatus(_props: Props) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [statusKey, setStatusKey] = useState("");
  const [userKey, setUserKey] = useState("");
  const { mutate } = useSWR(statusKey, fetchStatus);
  const { mutate: mutateUser } = useSWR(userKey, fetchUser);

  // Functions
  const getStatus = async () => {
    setLoading(true);
    const data = await mutate();
    // @ts-expect-error
    if (!data?.message) toast.success("Fetched status.");
    setCode(JSON.stringify(data, null, 2));
    setLoading(false);
  };
  const getUser = async () => {
    setLoading(true);
    const data = await mutateUser();
    // @ts-expect-error
    if (!data?.message) toast.success("Fetched user.");
    setCode(JSON.stringify(data, null, 2));
    setLoading(false);
  };

  // Handlers
  const onClickStatus = async () => {
    setStatusKey("fetchStatus");
    getStatus();
  };
  const onClickUser = async () => {
    setUserKey("fetchUser");
    getUser();
  };
  const onClickReset = () => {
    toast.info("Reset.");
    setCode("");
  };

  useEffect(() => {
    if (statusKey) getStatus();
    if (userKey) getUser();
  }, [statusKey, userKey]);
  return (
    <div className="flex flex-col w-full py-4 gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button loading={loading} variant="secondary" onClick={onClickStatus}>
            Check API status
          </Button>
          <Button loading={loading} variant="secondary" onClick={onClickUser}>
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
