import { zodResolver } from "@hookform/resolvers/zod";
import { navigate } from "astro:transitions/client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { apiClient, resetPassword, signIn } from "@/lib/clients";
import { sleep } from "@/lib/utils";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirm: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

interface ResetPasswordFormProps {
  token: string;
}

function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [loading, setLoading] = useState(false);
  console.log(token);

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { password } = values;

    setLoading(true);

    // Figure out the email
    const response = await apiClient["search-token"].$get({ query: { token } });
    const { email } = await response.json();

    await resetPassword(
      { newPassword: password },
      {
        onError: (ctx) => {
          toast.warning(ctx.error.message);
          setLoading(false);
        },
        onSuccess: async () => {
          toast.success("Password reset! Redirecting...", {
            closeButton: true,
            duration: 30000,
          });
          form.reset();

          await sleep(1000);
          if (!email) {
            navigate("/login");
            return;
          }

          await signIn.email(
            {
              callbackURL: "/dashboard",
              email,
              password,
            },
            { onError: () => navigate("/login") },
          );
        },
      },
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col">
      <Card className="">
        <CardHeader className="pb-4 text-center">
          <CardTitle>Reset password</CardTitle>
          <CardDescription>Enter a new password below.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" loading={loading}>
                Reset
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordForm;
