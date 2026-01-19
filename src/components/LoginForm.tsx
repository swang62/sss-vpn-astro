import type { TurnstileInstance } from "@marsidev/react-turnstile";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
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
import { PasswordInput } from "@/components/ui/password-input";
import { PUBLIC_TURNSTILE_SITEKEY } from "@/config/client";
import { signIn } from "@/lib/auth-clients";
const formSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string(),
});

function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;

    // Make sure captcha exists
    if (!token) {
      form.setError("root", { message: "Please verify captcha first." });
      return;
    }

    signIn.email(
      {
        callbackURL: "/dashboard",
        email,
        fetchOptions: {
          headers: {
            "x-captcha-response": token,
          },
        },
        password,
      },
      {
        // @ts-expect-error typing error
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
          turnstileRef.current?.reset();
          setToken("");
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
      }
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[350px] flex-col">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Log in</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                    <div className="flex items-center">
                      <FormLabel>Password</FormLabel>
                      <a
                        href="/forgot-password"
                        className="text-muted-foreground ml-auto inline-block text-right text-sm"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Turnstile
                ref={turnstileRef}
                className="my-2"
                siteKey={PUBLIC_TURNSTILE_SITEKEY}
                onSuccess={setToken}
                onExpire={() => turnstileRef.current?.reset()}
              />
              <FormMessage className="text-center">
                {form.formState.errors.root?.message}
              </FormMessage>

              <Button
                className="w-full"
                type="submit"
                loading={loading}
                disabled={loading}
                data-umami-event="login"
              >
                Log in
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="mt-4 text-center text-sm">
        Don't have an account?
        <a href="/signup" className="text-primary-link ml-2 underline">
          Sign up
        </a>
      </div>
    </div>
  );
}

export default LoginForm;
