import { zodResolver } from "@hookform/resolvers/zod";
import { createAuthClient } from "better-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { sleep } from "@/lib/utils";
import { paidSubscriptions } from "@/types";

const formSchema = z
  .object({
    email: z
      .string()
      .email({
        message: "Invalid email address",
      })
      .toLowerCase(),
    password: z.string().min(8),
    passwordConfirm: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

interface SignUpProps {
  plan: string;
}

function SignUpForm({ plan }: SignUpProps) {
  const [loading, setLoading] = useState(false);
  const { signUp } = createAuthClient();

  // Setup
  const isFreeTrial = !paidSubscriptions.includes(plan as any);

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const { email, password } = values;

    await signUp.email(
      {
        callbackURL: `/dashboard`,
        email,
        name: "",
        password,
      },
      {
        onError: (ctx) => {
          const status = ctx.error.status;
          if (status === 422) {
            form.setError(
              "email",
              { message: "Email already exists, did you mean to login?" },
              { shouldFocus: true },
            );
          }
          setLoading(false);
        },
        onRequest: async () => {
          setLoading(true);
          await sleep(1000); // FIXME: Simulate request delay
        },
        onSuccess: () => {
          console.log("Successfully created account, redirecting...");
          setLoading(false);
        },
      },
    );
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          {isFreeTrial
            ? "Trial period will start immediately after signup"
            : "Pick a plan after account creation"}
        </CardDescription>
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
                  {/* <FormDescription>
                    If in China, use an unblocked email domain
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
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
              Create account
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm">
          Already have an account?
          <a href="/login" className="ml-2 text-primary-link underline">
            Login
          </a>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            Terms and conditions
            <Popover>
              <PopoverTrigger>
                <span className="ml-1 text-primary-link">here</span>
              </PopoverTrigger>
              <PopoverContent>
                <h1 className="text-center font-heading text-lg">
                  Terms and Conditions
                </h1>
                <hr className="my-3" />
                <p>
                  Nothing fancy here... I won't sell or distribute any of your
                  data. I don't store logs. All financial stuff is handled
                  off-site with Stripe. Just please
                  <span className="text-destructive"> don't torrent </span>
                  any movies/tv shows. Otherwise, I'll have to shut everything
                  down and then everyone will be sad. Thanks.
                </p>
              </PopoverContent>
            </Popover>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SignUpForm;
