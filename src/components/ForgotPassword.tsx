import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiClient, parseApi } from "@/lib/api-clients";
import { forgetPassword } from "@/lib/auth-client";
import { secondsPassed } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email().toLowerCase(),
});

interface Props {}

function ForgotPasswordForm(_props: Props) {
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const minutesSince = Math.floor(secondsPassed(sentEmail) / 60);
    if (minutesSince < 1) {
      toast.warning(`Please wait a minute before trying again.`);
      return;
    }

    const { email } = values;
    const { data } = await parseApi(apiClient["search-email"].$get({ query: { email } }));

    if (!data?.exists) {
      form.setError(
        "email",
        { message: "Email not found in our system." },
        { shouldFocus: true },
      );
      return;
    }

    await forgetPassword(
      {
        email,
        redirectTo: "/reset-password",
      },
      {
        onError: (ctx) => {
          toast.warning(ctx.error.message);
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast.success("Email sent! Check your inbox.", {
            closeButton: true,
            duration: 30000,
          });
          form.reset();
          setSentEmail(new Date().toISOString());
          setLoading(false);
        },
      },
    );
  }

  return (
    <div className="flex flex-col w-full max-w-xs mx-auto">
      <Card className="">
        <CardHeader className="pb-4 text-center">
          <CardTitle className="text-2xl">Forgot password?</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" loading={loading} disabled={loading}>
                Send reset link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-4 text-sm text-center">
        <a
          href="/login"
          className="flex items-center justify-center mr-4 text-center text-foreground hover:underline"
        >
          <ChevronLeft className="h-4" />
          Back to login
        </a>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
