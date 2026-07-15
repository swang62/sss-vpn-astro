import { navigate } from "astro:transitions/client";
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
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword, signIn } from "@/lib/auth-clients";
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

interface Props {
  email?: string;
  token: string;
}

function ResetPasswordForm({ email, token }: Props) {
  const [loading, setLoading] = useState(false);

  if (!email || !token) {
    toast.error("Invalid token! Redirecting...");
    sleep(1000).then(() => {
      if (typeof window !== "undefined")
        window.location.href = "/forgot-password";
    });
    return;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { password: "", passwordConfirm: "" },
    resolver: zodResolver(formSchema),
  });

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
        onRequest: () => setLoading(true),
        onSuccess: () => {
          toast.success("Password reset. Redirecting...");
          form.reset();
          sleep(1000).then(() =>
            signIn.email(
              { callbackURL: "/dashboard", email, password },
              { onError: () => navigate("/login") }
            )
          );
        },
      }
    );
  }

  return (
    <>
      <h2 className="mb-1 text-center font-heading text-2xl">Reset password</h2>
      <p className="mb-6 text-center font-mono text-muted-foreground text-xs tracking-wider">
        Enter a new password below.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs tracking-widest">
                  Password
                </FormLabel>
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
                <FormLabel className="font-mono text-xs tracking-widest">
                  Confirm Password
                </FormLabel>
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
          >
            Reset
          </Button>
        </form>
      </Form>
    </>
  );
}

export default ResetPasswordForm;
