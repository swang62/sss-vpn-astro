import ReactJsonView from "@microlink/react-json-view";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { Option } from "@/config/types";
import type { HonoClient, UserFull } from "@/lib/api-clients";

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
import { useMounted } from "@/hooks/use-mounted";
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
  const [loadingText, setLoadingText] = useState("Loading...");
  const [endpoint, setEndpoint] = useState<Endpoint>("");
  const [users, setUsers] = useState<Option[]>([]);
  const [userIdSelected, setUserSelected] = useState("");
  const [userActive, setUserActive] = useState<UserFull | null>(null);

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
        // @ts-expect-error expected fake api
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

    const { data, error } = await parseApi(
      api.user[":id"].$get({ param: { id: userIdSelected } })
    );
    if (!data || error) {
      toast.error(error);
      setLoading(false);
      return;
    }
    setUserActive(data._user);
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
    if (!data || error) {
      toast.error(error?.message);
      return;
    }
    const userOptions = data.users.map(
      (user): Option => ({ label: user.email, value: user.id })
    );
    setUsers(userOptions);
    setLoadingText("Select a user...");
  };

  const deleteUser = async () => {
    setLoading(true);

    const { data, error } = await parseApi(
      api.user[":id"].$delete({ param: { id: userIdSelected } })
    );
    if (!data || error) {
      toast.error(error);
      setLoading(false);
      return;
    }
    setCode(data);
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

  useEffect(() => {
    setUserActive(null);
  }, [endpoint, userIdSelected]);

  return (
    <div className="mx-auto flex w-full flex-col gap-2 pb-0 md:pt-6">
      <div className="flex flex-row gap-2">
        <Combobox
          options={options}
          value={endpoint}
          setValue={setEndpoint}
          defaultValue="Request API..."
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
          setValue={setUserSelected}
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
          Reset Console
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="flex grow"
              disabled={!userActive}
            >
              Delete User
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
                className="bg-destructive hover:bg-destructive/80 cursor-pointer"
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
