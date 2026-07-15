import { navigate } from "astro:transitions/client";
import ReactJsonView from "@microlink/react-json-view";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import type UAParser from "ua-parser-js";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import type { Option } from "@/config/types";
import { useMounted } from "@/hooks/use-mounted";
import type { HonoClient, UserFull } from "@/lib/api-clients";
import { api, parseApi } from "@/lib/api-clients";
import { admin } from "@/lib/auth-clients";

type Endpoint =
  | "/status"
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
    label: "GET /me",
    value: "/user",
  },
  {
    label: "GET /hiddify",
    value: "/usage",
  },
  {
    label: "GET /stripe",
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
  const { mutate } = useSWRConfig();
  const defaultCode = { device, origin };
  const mounted = useMounted();
  const [code, setCode] = useState<object>(defaultCode);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Loading...");
  const [endpoint, setEndpoint] = useState("");
  const [users, setUsers] = useState<Option[]>([]);
  const [userIdSelected, setUserSelected] = useState("");
  const [userActive, setUserActive] = useState<UserFull | null>(null);

  // Handlers
  const getEndpoint = async () => {
    setLoading(true);

    let client: HonoClient | null = null;
    switch (endpoint as Endpoint) {
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
        // @ts-expect-error expected fake api
        client = api.fakeEndpoint.$put;
        break;
    }

    if (client) {
      const result = await parseApi(client);
      if (!result.ok) {
        toast.error(result.error);
        if (result.error?.includes("path")) {
          setLoading(false);
          throw new Error("Manually triggered client-side error");
        }
        setLoading(false);
        return;
      }
      setCode(result.data);
    }
    setLoading(false);
  };

  const getUser = async () => {
    setLoading(true);

    const result = await parseApi(api.user[":id"].$get, {
      param: { id: userIdSelected },
    });
    if (!result.ok) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    setUserActive(result.data._user);
    setCode(result.data);
    setLoading(false);
  };

  const getAllUsers = async () => {
    const { data, error } = await admin.listUsers({
      query: {
        sortBy: "email",
        sortDirection: "asc",
      },
    });
    if (!data || error) {
      toast.error(error?.message);
      return;
    }
    const userOptions = data.users.map(
      (user): Option => ({
        label: user.email,
        value: user.id,
      })
    );
    setUsers(userOptions);
    setLoadingText("Select a user...");
  };

  const impersonateUser = async () => {
    const { data, error } = await admin.impersonateUser({
      userId: userActive?.id,
    });
    if (!data || error) {
      toast.error(error?.message);
      return;
    }
    await mutate("fetchUser");
    navigate("/dashboard");
  };

  const deleteUser = async () => {
    setLoading(true);

    const result = await parseApi(api.user[":id"].$delete, {
      param: { id: userIdSelected },
    });
    if (!result.ok) {
      toast.error(result.error);
      setLoading(false);
      return;
    }
    setCode(result.data);
    setLoading(false);
  };

  const onReset = () => {
    setCode(defaultCode);
    setEndpoint("");
    setUserSelected("");
    getAllUsers();
  };

  // Lifecycle
  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="mx-auto flex w-full flex-col gap-2 pb-0 md:pt-6">
      <div className="flex flex-row gap-2">
        <Combobox
          options={options}
          value={endpoint}
          setValue={(v) => {
            setEndpoint(v);
            setUserActive(null);
          }}
          defaultValue="API endpoint..."
        />
        <Button
          loading={loading}
          variant="secondary"
          onClick={getEndpoint}
          disabled={!endpoint}
        >
          Go
        </Button>
      </div>
      <div className="flex flex-row gap-2">
        <Combobox
          options={users}
          value={userIdSelected}
          setValue={(v) => {
            setUserSelected(v);
            setUserActive(null);
          }}
          defaultValue={loadingText}
        />
        <Button
          loading={loading}
          variant="secondary"
          onClick={getUser}
          disabled={users.length === 0 || !userIdSelected}
        >
          Go
        </Button>
      </div>

      <code className="dark max-h-[68vh] min-h-[68vh] overflow-y-auto">
        {mounted && (
          <ReactJsonView
            src={code}
            sortKeys
            enableClipboard={false}
            displayDataTypes={false}
            displayObjectSize={false}
            style={{ background: "rgb(31, 32, 53)", fontSize: 14 }}
            theme="chalk"
          />
        )}
      </code>

      <div className="flex flex-row gap-2">
        <Button variant="default" className="flex grow" onClick={onReset}>
          Reset
        </Button>

        <Button
          variant="secondary"
          className="flex grow"
          onClick={impersonateUser}
          disabled={!userActive}
        >
          Impersonate
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex grow"
              disabled={!userActive}
            >
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="flex flex-col text-lg">
                <span>Email: {userActive?.email}</span>
                <span>Name: {userActive?.name}</span>
                <span>HiddifyId: {userActive?.profile?.hiddifyId}</span>
                <span>Stripe: {userActive?.profile?.stripeCustomerId}</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="cursor-pointer bg-destructive hover:bg-destructive/80"
                onClick={deleteUser}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ApiStatus;
