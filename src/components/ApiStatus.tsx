import { useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/clients";

const getStatus = () => apiClient.status.$get().then((res) => res.json());
const getUser = () => apiClient.user.$get().then((res) => res.json());
function getSession() {
  return apiClient.user.session.$get().then((res) => res.json());
}

interface Props {}

function ApiStatus(_props: Props) {
  const [code, setCode] = useState("");
  const { error, mutate } = useSWR("/api/status", getStatus);
  const { error: errorUser, mutate: mutateUser } = useSWR("/api/user", getUser);
  const { error: errorSession, mutate: mutateSession } = useSWR(
    "/api/user/session",
    getSession,
  );

  // Handlers
  const onClickStatus = async () => {
    const data = await mutate();
    toast.success("Fetched.", { position: "bottom-center" });
    setCode(JSON.stringify(data, null, 2));
  };
  const onClickUser = async () => {
    const data = await mutateUser();
    toast.success("Fetched.", { position: "bottom-center" });
    setCode(JSON.stringify(data, null, 2));
  };
  const onClickSession = async () => {
    const data = await mutateSession();
    toast.success("Fetched.", { position: "bottom-center" });
    setCode(JSON.stringify(data, null, 2));
  };
  const onClickReset = () => {
    toast.info("Reset.", { position: "bottom-center" });
    setCode("");
  };

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 py-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={onClickStatus}>
            Check API Status
          </Button>
          <Button variant="secondary" onClick={onClickUser}>
            Get User
          </Button>
          <Button variant="secondary" onClick={onClickSession}>
            Get Session
          </Button>
        </div>
        <Button variant="destructive" onClick={onClickReset}>
          Reset
        </Button>
      </div>
      <code>{code || error || errorUser || errorSession}</code>
    </div>
  );
}

export default ApiStatus;
