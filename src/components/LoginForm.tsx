import { zodResolver } from "@hookform/resolvers/zod";
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
import { PasswordInput } from "@/components/ui/password-input";
import { signIn } from "@/lib/auth-clients";

const formSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string(),
});

interface Props {}

function LoginForm(_props: Props) {
  const [loading, setLoading] = useState(false);

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
    signIn.email(
      {
        callbackURL: "/dashboard",
        email,
        password,
      },
      {
        onError: (ctx) => {
          const status = ctx.error.status;
          if (status === 401) {
            form.setError(
              "password",
              { message: ctx.error.message },
              { shouldFocus: true },
            );
          } else if (status === 429) {
            toast.warning(ctx.error.message);
          }
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
      },
    );
  }

  return (
    <Card className="w-full max-w-xs mx-auto">
      <CardHeader className="pb-4 text-center">
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
                      className="inline-block ml-auto text-sm text-right text-muted-foreground"
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

            <Button className="w-full" type="submit" loading={loading} disabled={loading}>
              Log in
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-sm text-center">
          Don't have an account?
          <a
            href="/signup"
            className="ml-2 underline text-primary-link"
          >
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
