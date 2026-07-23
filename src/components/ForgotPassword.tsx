import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MIN_WAIT_TIME } from "@/config/constants";
import { api, parseApi } from "@/lib/api-clients";
import { requestPasswordReset } from "@/lib/auth-clients";
import { secondsSince } from "@/lib/utils";

const formSchema = z.object({
  email: z.email().toLowerCase(),
});

function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: "" },
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const waitTime = secondsSince(sentEmail);
    if (waitTime < MIN_WAIT_TIME) {
      toast.warning("Please wait a sec before trying again.");
      return;
    }

    const { email } = values;
    const result = await parseApi(api["search-email"].$get, {
      query: { email },
    });

    if (!result.ok || !result.data?.exists) {
      form.setError(
        "email",
        { message: "Email does not exist." },
        { shouldFocus: true }
      );
      return;
    }

    await requestPasswordReset(
      { email, redirectTo: "/reset-password" },
      {
        onError: (ctx) => {
          toast.warning(ctx.error.message);
          setLoading(false);
        },
        onRequest: () => setLoading(true),
        onSuccess: () => {
          toast.success("Email sent! Check your inbox.");
          form.reset();
          setSentEmail(new Date().toISOString());
          setLoading(false);
        },
      }
    );
  }

  return (
    <>
      <h2 className="mb-6 text-center font-heading text-2xl">
        Forgot password?
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs tracking-widest">
                  Email address
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full font-mono tracking-widest"
            type="submit"
            loading={loading}
            disabled={loading}
            data-umami-event="password-reset"
          >
            Send reset link
          </Button>
        </form>
      </Form>
      <a
        href="/login"
        className="flex items-center justify-center gap-1 pt-6 font-mono text-muted-foreground text-xs tracking-wider transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3" />
        Back to login
      </a>
    </>
  );
}

export default ForgotPasswordForm;
