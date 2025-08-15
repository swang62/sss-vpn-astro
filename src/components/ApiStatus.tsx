import { useState } from "react";
import { toast } from "sonner";

import type { Option } from "@/config/types";
import type { HonoClient } from "@/lib/api-clients";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { api, parseApi } from "@/lib/api-clients";
import { admin } from "@/lib/auth-clients";

type Endpoint
  = "/status"
    | "/user"
    | "/usage"
    | "/stripe"
    | "/all-users"
    | "/server-error"
    | "/client-error"
    | "";

const options: Option[] = [
  {
    label: "GET /api/status",
    value: "/status",
  },
  {
    label: "GET /user/db",
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
    label: "GET /users/all",
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
] satisfies {
  value: Endpoint;
  label: string;
}[];

interface Props {
  device: UAParser.IResult;
  pathname: string;
  origin: string;
}

function ApiStatus(props: Props) {
  const defaultOutput = JSON.stringify(props, null, 2);

  const [code, setCode] = useState(defaultOutput);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState<Endpoint>("");
  const [users, setUsers] = useState<Option[]>([]);
  const [userId, setUserId] = useState("");

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
      }
      setCode(JSON.stringify(data || error, null, 2));
    } else if (endpoint === "/all-users") {
      const { data, error } = await admin.listUsers({
        query: {
          sortBy: "email",
          sortDirection: "asc",
        },
      });
      if (!data || error) {
        toast.error(error?.message);
      }
      setCode(JSON.stringify(data?.users || error?.message, null, 2));

      // Populate users list
      if (data) {
        const userOptions = data.users.map((user): Option => ({ label: user.email, value: user.id }));
        setUsers(userOptions);
      }
    }

    setLoading(false);
  };

  const getUser = async () => {
    setLoading(true);

    const { data, error } = await parseApi(api.user[":id"].$get({ param: { id: userId } }));
    if (!data || error) {
      toast.error(error);
    }
    setCode(JSON.stringify(data || error, null, 2));

    setLoading(false);
  };

  const resetUser = () => {
    setEndpoint("");
    setCode(defaultOutput);
  };

  return (
    <div className="flex flex-col w-full pb-0 gap-4 md:pt-2 mx-auto">
      <div className="flex flex-row gap-2">
        <Combobox options={options} value={endpoint} setValue={setEndpoint} defaultValue="API endpoint..." />
        <Button loading={loading} variant="secondary" onClick={getEndpoint} disabled={!endpoint}>
          Go
        </Button>
      </div>
      <div className="flex flex-row gap-2">
        <Combobox options={users} value={userId} setValue={setUserId} defaultValue="User..." />
        <Button loading={loading} variant="secondary" onClick={getUser} disabled={users.length === 0}>
          Go
        </Button>
      </div>

      <code className="min-h-[68vh] max-h-[68vh] overflow-y-auto dark">{code}</code>

      <Button variant="destructive" className="w-full" onClick={resetUser}>
        Reset
      </Button>
    </div>
  );
}

export default ApiStatus;
