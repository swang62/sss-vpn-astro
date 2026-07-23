import { zodResolver } from "@hookform/resolvers/zod";
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
import { PasswordInput } from "@/components/ui/password-input";
import { signIn } from "@/lib/auth-clients";

const formSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string(),
});

function LoginForm() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    signIn.email(
      { callbackURL: "/dashboard", email, password },
      {
        onError: (ctx) => {
          const status = ctx.error.status;
          if (status === 401) {
            form.setError(
              "password",
              { message: ctx.error.message },
              { shouldFocus: true }
            );
          } else if (status === 429) {
            toast.warning(ctx.error.message);
          }
          setLoading(false);
        },
        onRequest: () => setLoading(true),
      }
    );
  }

  return (
    <>
      <h2 className="mb-6 text-center font-heading text-2xl">Log in</h2>
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
                  Email
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="font-mono text-xs tracking-widest">
                    Password
                  </FormLabel>
                  <a
                    href="/forgot-password"
                    className="font-mono text-[11px] text-primary tracking-wider transition-colors hover:text-primary-link"
                  >
                    Forgot?
                  </a>
                </div>
                <FormControl>
                  <PasswordInput {...field} />
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
            data-umami-event="login"
            data-astro-reload
          >
            Log in
          </Button>
        </form>
      </Form>
      <p className="pt-6 text-center font-mono text-muted-foreground text-xs tracking-wider">
        Need an account?{" "}
        <a
          href="/signup"
          className="font-semibold text-secondary-link transition-colors hover:text-secondary"
        >
          Sign up
        </a>
      </p>
    </>
  );
}

export default LoginForm;
