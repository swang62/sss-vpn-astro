import ReactJsonView from "@microlink/react-json-view";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Option } from "@/config/types";
import type { HonoClient } from "@/lib/api-clients";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { useMounted } from "@/hooks/use-mounted";
import { api, parseApi } from "@/lib/api-clients";
import { admin } from "@/lib/auth-clients";

type Endpoint
  = "/status"
    | "/user"
    | "/usage"
    | "/stripe"
    | "/server-error"
    | "/client-error"
    | "";

const options: Option[] = [
  {
    label: "GET /status",
    value: "/status",
  },
  {
    label: "GET /user/me",
    value: "/user",
  },
  {
    label: "GET /user/hiddify",
    value: "/usage",
  },
  {
    label: "GET /user/stripe",
    value: "/stripe",
  },
  {
    label: "PUT /server-error",
    value: "/server-error",
  },
  {
    label: "PUT /client-error",
    value: "/client-error",
  },
] satisfies {
  value: Endpoint;
  label: string;
}[];

interface Props {
  device: UAParser.IResult;
  origin: string;
}

function ApiStatus({ device, origin }: Props) {
  const defaultCode = { device, origin };
  const mounted = useMounted();
  const [code, setCode] = useState<object>(defaultCode);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState<Endpoint>("");
  const [users, setUsers] = useState<Option[]>([]);
  const [userSelected, setUserSelected] = useState("");

  // Handlers
  const getEndpoint = async () => {
    setLoading(true);

    let client: HonoClient | null = null;
    switch (endpoint) {
      case "/status":
        client = api.status.$get;
        break;
      case "/user":
        client = api.user.$get;
        break;
      case "/usage":
        client = api.hiddify.usage.$get;
        break;
      case "/stripe":
        client = api.stripe.user.$get;
        break;
      case "/server-error":
        client = api.error.$put;
        break;
      case "/client-error":
        // @ts-expect-error
        client = api.fakeEndpoint.$put;
        break;
    }

    if (client) {
      const { data, error } = await parseApi(client());
      if (!data || error) {
        toast.error(error);
        if (error?.includes("path")) {
          setLoading(false);
          throw new Error("Manually triggered client-side error");
        }
        setLoading(false);
        return;
      }
      setCode(data);
    }

    setLoading(false);
  };

  const getUser = async () => {
    setLoading(true);

    const { data, error } = await parseApi(api.user[":id"].$get({ param: { id: userSelected } }));
    if (!data || error) {
      toast.error(error);
      setLoading(false);
      return;
    }
    setCode(data);
    setLoading(false);
  };

  const getAllUsers = async () => {
    const { data, error } = await admin.listUsers({
      query: {
        sortBy: "email",
        sortDirection: "asc",
      },
    });
    if (!data || error) toast.error(error?.message);
    if (data) {
      const userOptions = data.users.map((user): Option => ({ label: user.email, value: user.id }));
      setUsers(userOptions);
    }
  };

  const onReset = () => {
    setEndpoint("");
    setUserSelected("");
    setCode(defaultCode);
    getAllUsers();
  };

  // Lifecycle
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="flex flex-col w-full pb-0 gap-2 md:pt-6 mx-auto">
      <div className="flex flex-row gap-2">
        <Combobox options={options} value={endpoint} setValue={setEndpoint} defaultValue="API endpoint..." />
        <Button loading={loading} variant="secondary" onClick={getEndpoint} disabled={!endpoint}>
          Go
        </Button>
      </div>
      <div className="flex flex-row gap-2">
        <Combobox options={users} value={userSelected} setValue={setUserSelected} defaultValue="Select user..." />
        <Button loading={loading} variant="secondary" onClick={getUser} disabled={users.length === 0 || !userSelected}>
          Go
        </Button>
      </div>

      <code className="min-h-[68vh] max-h-[68vh] overflow-y-auto dark">
        {mounted && (
          <ReactJsonView
            src={code}
            sortKeys
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={false}
            style={{ background: "rgb(31, 32, 53)" }}
            theme="chalk"
          />
        )}
      </code>

      <Button variant="destructive" className="w-full" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}

export default ApiStatus;
