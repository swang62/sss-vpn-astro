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
import { apiClient, forgetPassword } from "@/lib/clients";
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
    const response = await apiClient["search-email"].$get({ query: { email } });
    if (response.ok) {
      const { exists } = await response.json();
      if (!exists) {
        form.setError(
          "email",
          { message: "Email not found in our system." },
          { shouldFocus: true },
        );
        return;
      }
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
    <div className="mx-auto flex w-full max-w-xs flex-col">
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

              <Button className="w-full" type="submit" loading={loading}>
                Send reset link
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm">
        <a
          href="/login"
          className="mr-4 flex items-center justify-center text-center text-foreground hover:underline"
          data-astro-reload
        >
          <ChevronLeft className="h-4" />
          Back to login
        </a>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
