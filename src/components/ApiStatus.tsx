import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { HonoClient } from "@/lib/api-clients";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { apiClient, parseApi } from "@/lib/api-clients";
import { admin } from "@/lib/auth-clients";

type Endpoint = "/status" | "/user" | "/server-error" | "/client-error" | "/all-users" | "";
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
  {
    label: "GET /all-users",
    value: "/all-users",
  },
  {
    label: "PUT /server-error",
    value: "/server-error",
  },
  {
    label: "PUT /client-error",
    value: "/client-error",
  },
];

interface Props {
  device: UAParser.IResult;
  pathname: string;
  origin: string;
}

function ApiStatus(props: Props) {
  const defaultOutput = JSON.stringify(props, null, 2);

  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState<Endpoint>("");
  const [disabled, setDisabled] = useState(true);
  const [code, setCode] = useState(defaultOutput);

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
      case "/server-error":
        client = apiClient.error.$put;
        break;
      case "/client-error":
        // @ts-expect-error
        client = apiClient.fakeEndpoint.$put;
        break;
    }

    if (client) {
      const { data, error } = await parseApi(client());
      if (error) {
        toast.error(error);
        if (error.includes("path")) {
          setLoading(false);
          throw new Error("Manually triggered client-side error");
        }
      }
      setCode(JSON.stringify(data || error, null, 2));
    } else if (endpoint === "/all-users") {
      const { data: users, error } = await admin.listUsers({
        query: {
          sortBy: "email",
          sortDirection: "asc",
        },
      });
      if (error) {
        toast.error(error.message);
      }
      setCode(JSON.stringify(users || error?.message, null, 2));
    }

    setLoading(false);
  };
  const resetUser = () => {
    setEndpoint("");
    setCode(defaultOutput);
  };

  // Lifecycle
  useEffect(() => {
    if (!endpoint) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
    return () => setDisabled(true);
    ;
  }, [endpoint]);

  return (
    <div className="flex flex-col w-full pb-0 gap-4 md:pt-6">
      <div className="flex flex-row justify-start gap-2">
        <Button loading={loading} variant="secondary" onClick={getEndpoint} disabled={disabled}>
          Request
        </Button>
        <Combobox options={options} value={endpoint} setValue={setEndpoint} defaultValue="Select..." />
      </div>

      <code className="min-h-[68vh] max-h-[68vh] overflow-y-auto">{code}</code>

      <Button variant="destructive" className="w-full" onClick={resetUser}>
        Reset
      </Button>
    </div>
  );
}

export default ApiStatus;
