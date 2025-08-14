import { useState } from "react";
import { toast } from "sonner";

import type { HonoClient } from "@/lib/api-clients";

import { Button } from "@/components/ui/button";
import { apiClient, parseApi } from "@/lib/api-clients";

import { Combobox } from "./ui/combobox";

type Endpoint = "/status" | "/user";
type EndpointOption = {
  value: Endpoint;
  label: string;
};

const options: EndpointOption[] = [
  {
    label: "GET /status",
    value: "/status",
  },
  {
    label: "GET /user",
    value: "/user",
  },
];

interface Props {}

function ApiStatus(_props: Props) {
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState<Endpoint | undefined>();
  const [code, setCode] = useState("");

  // Handlers
  const getEndpoint = async () => {
    setLoading(true);

    let client: HonoClient | null = null;
    switch (endpoint) {
      case "/status":
        client = apiClient.status.$get;
        break;
      case "/user":
        client = apiClient.user.$get;
        break;
    }

    if (client) {
      const { data, error } = await parseApi(client());
      if (error) {
        toast.error(error);
        return;
      }
      setCode(JSON.stringify(data, null, 2));
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full py-4 gap-4">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Combobox options={options} value={endpoint} setValue={setEndpoint} defaultValue="<Select Payload>" />
          <Button loading={loading} variant="secondary" onClick={getEndpoint}>
            Request
          </Button>
        </div>
        <Button variant="destructive" onClick={() => setCode("")}>
          Clear
        </Button>
      </div>
      <code className="min-h-[70vh] max-h-[70vh] overflow-y-auto">{code}</code>
    </div>
  );
}

export default ApiStatus;
