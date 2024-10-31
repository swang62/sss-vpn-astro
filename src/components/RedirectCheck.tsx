import { navigate } from "astro:transitions/client";
import { toast } from "sonner";
import useSWR from "swr";

import { fetchSession } from "@/lib/api-clients";
import { sleep } from "@/lib/utils";

interface Props {}

function RedirectCheck(_props: Props) {
  // Hooks
  const { data, error, isLoading } = useSWR("fetchSession", fetchSession);
  if (error || isLoading) return null;

  if (data?.session) {
    toast.success("Already logged in. Redirecting...");
    sleep(1500).then(() => navigate("/dashboard"));
  }

  return null;
}

export default RedirectCheck;
