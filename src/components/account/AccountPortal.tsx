import { navigate } from "astro:transitions/client";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, parseApi } from "@/lib/api-clients";

function AccountPortal() {
  const [loading, setLoading] = useState(false);

  // Handlers
  const redirectCustomerPortal = async () => {
    setLoading(true);
    const result = await parseApi(api.stripe["customer-portal"].$post);
    if (result.ok && result.data?.url) {
      navigate(result.data.url);
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
        <p>
          Manage your plan, update your payment details, or view past invoices
          on Stripe.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          disabled={loading}
          loading={loading}
          onClick={redirectCustomerPortal}
        >
          <ExternalLink />
          Visit portal
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AccountPortal;
