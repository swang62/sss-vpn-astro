import { navigate } from "astro:transitions/client";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api, parseApi } from "@/lib/api-clients";

interface Props {}

function AccountPortal(_props: Props) {
  const [loading, setLoading] = useState(false);

  // Handlers
  const redirectCustomerPortal = async () => {
    setLoading(true);
    const { data } = await parseApi(api.stripe["customer-portal"].$post());
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
        <CardTitle>Billing & Invoices</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p>Manage your plan, update your payment details, or view past invoices.</p>
      </CardContent>
      <CardFooter className="bg-muted justify-between gap-4 border-t py-4">
        <span className="text-muted-foreground">Powered by Stripe</span>
        <Button disabled={loading} loading={loading} onClick={redirectCustomerPortal}>
          <span>Visit portal</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AccountPortal;
