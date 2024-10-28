import { navigate } from "astro:transitions/client";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { apiClient, parseApi } from "@/lib/api-clients";

interface Props {}

function AccountDetails(_props: Props) {
  const [loading, setLoading] = useState(false);

  // Handlers
  const redirectCustomerPortal = async () => {
    setLoading(true);
    const { data } = await parseApi(
      apiClient.stripe["customer-portal"].$post(),
    );
    if (data?.url) {
      navigate(data.url);
    } else {
      toast.error("Unknown error, please try again later.");
      setLoading(false);
    }
  };

  return (
    <Card x-chunk="Subscription plan details">
      <CardHeader>
        <h1 className="text-xl">Billing & Invoices</h1>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p>
          Use the link below to manage your plan manually, update your payment details, or view past invoices.
        </p>
      </CardContent>
      <CardFooter className="justify-between gap-4 py-4 border-t bg-accent">
        <span className="text-muted-foreground">
          Powered by Stripe
        </span>
        <Button
          loading={loading}
          onClick={redirectCustomerPortal}
        >
          <span>Visit customer portal</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AccountDetails;
