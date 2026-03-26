import { navigate } from "astro:transitions/client";
import { toast } from "sonner";
import useSWR from "swr";

import { fetchSession } from "@/lib/api-clients";
import { sleep } from "@/lib/utils";

function RedirectCheck() {
  // Hooks
  const { data, error, isLoading } = useSWR("fetchSession", fetchSession, {
    revalidateIfStale: false,
  });
  if (error || isLoading) return null;

  if (data?.session) {
    toast.success("Already logged in. Redirecting...", { duration: 1500 });
    sleep(1000).then(() => navigate("/dashboard"));
  }

  return null;
}

export default RedirectCheck;
