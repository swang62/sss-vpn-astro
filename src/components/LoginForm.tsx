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
import { signIn } from "@/lib/clients";

const formSchema = z.object({
  email: z
    .string()
    .email({
      message: "Invalid email address",
    })
    .toLowerCase(),
  password: z.string(),
});

interface LoginProps {}

function LoginForm(_props: LoginProps) {
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
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password } = values;
    await signIn.email(
      {
        callbackURL: "/dashboard",
        email,
        password,
      },
      {
        onError: (ctx) => {
          console.dir(ctx.error);
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
        onRequest: async () => {
          setLoading(true);
        },
      },
    );
  }

  return (
    <Card className="mx-auto w-full max-w-xs">
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
                      href="/forgot"
                      className="ml-auto inline-block text-right text-sm underline"
                      data-astro-reload
                    >
                      Forgot password?
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit" loading={loading}>
              Log in
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Don't have an account?
          <a
            href="/signup"
            className="ml-2 text-primary-link underline"
            data-astro-reload
          >
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export default LoginForm;
