import { navigate } from "astro:transitions/client";
import { ExternalLink, Receipt } from "lucide-react";
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
        <div className="flex items-center gap-2">
          {/*<Receipt className="size-5 text-primary" />*/}
          <CardTitle className="translate-y-px font-heading">
            Billing & Invoices
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Manage your plan, update payment details, or view past invoices
          through the Stripe customer portal.
        </p>
      </CardContent>
      <CardFooter>
        <Button
          disabled={loading}
          loading={loading}
          size="sm"
          onClick={redirectCustomerPortal}
          className="gap-1.5"
        >
          <ExternalLink className="size-3.5" />
          Visit portal
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AccountPortal;
