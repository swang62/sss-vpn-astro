import { navigate } from "astro:transitions/client";
import { toast } from "sonner";
import useSWR from "swr";

import { fetchUser } from "@/lib/clients";
import { sleep } from "@/lib/utils";

interface Props {}

function RedirectCheck(_props: Props) {
  // Hooks
  const { data, error, isLoading } = useSWR("/api/user", fetchUser);
  if (error || isLoading) return null;

  if (data?.session) {
    toast.success("Logged in! Redirecting...");
    sleep(1000).then(() => navigate("/dashboard"));
  }

  return null;
}

export default RedirectCheck;
