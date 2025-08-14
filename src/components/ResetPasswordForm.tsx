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
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword, signIn } from "@/lib/auth-client";
import { sleep } from "@/lib/utils";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirm: z.string().optional(),
  })
  .refine(data => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

interface Props {
  email?: string;
  token: string;
}

function ResetPasswordForm({ email, token }: Props) {
  const [loading, setLoading] = useState(false);

  // Validate token/email
  if (!email || !token) {
    toast.error("Invalid token! Redirecting...");
    sleep(1000).then(() => navigate("/forgot-password"));
    return;
  }

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!email) return;
    const { password } = values;

    resetPassword(
      { newPassword: password, token },
      {
        onError: (ctx) => {
          toast.warning(ctx.error.message);
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          toast.success("Password reset. Redirecting...");
          form.reset();
          sleep(1000).then(() => signIn.email(
            {
              callbackURL: "/dashboard",
              email,
              password,
            },
            { onError: () => navigate("/login") },
          ));
        },
      },
    );
  }

  return (
    <div className="flex flex-col w-full max-w-xs mx-auto">
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
                      <PasswordInput {...field} />
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
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-full" type="submit" loading={loading} disabled={loading}>
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
