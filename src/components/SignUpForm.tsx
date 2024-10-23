import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { sendVerificationEmail, signUp } from "@/lib/clients";
import { subscriptionPaid } from "@/lib/types";
import { secondsPassed } from "@/lib/utils";

const formSchema = z
  .object({
    email: z.string().email().toLowerCase(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirm: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

interface SignUpProps {
  plan?: string | null;
}

function SignUpForm({ plan }: SignUpProps) {
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

  // Setup
  const isFreeTrial = !subscriptionPaid.includes(plan as any);

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
    const timeSince = secondsPassed(sentEmail);
    if (timeSince < 10) {
      toast.warning("Too many signup attempts, try again later.");
      return;
    }

    const { email, password } = values;
    await signUp.email(
      {
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
              { message: "Email already exists." },
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
        onSuccess: () => {
          sendVerificationEmail({
            callbackURL: "/dashboard",
            email,
          });

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
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          {isFreeTrial
            ? "Trial period will start after verification."
            : "Pick a plan after account creation."}
          <br />
          If in China, use an unblocked email
          <Popover>
            <PopoverTrigger>
              <span className="ml-1 text-secondary underline">provider</span>
            </PopoverTrigger>
            <PopoverContent>
              <h1 className="font-heading">Recommended Providers</h1>
              <hr className="my-3" />
              <ul>
                <li>microsoft.com</li>
                <li>outlook.com</li>
                <li>live.com</li>
                <li>icloud.com</li>
                <li>163.com</li>
              </ul>
            </PopoverContent>
          </Popover>
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
          <a
            href="/login"
            className="ml-2 text-primary-link underline"
            data-astro-reload
          >
            Log in
          </a>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-center border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            Terms and conditions
            <Popover>
              <PopoverTrigger>
                <span className="ml-1 font-medium text-foreground">here</span>
              </PopoverTrigger>
              <PopoverContent>
                <h1 className="font-heading">Terms and Conditions</h1>
                <hr className="my-3" />
                <p>
                  Nothing fancy here... I won't sell or distribute any of your
                  data. I don't store logs. All financial stuff is handled
                  off-site with Stripe. Please
                  <span className="text-destructive"> don't torrent </span>
                  any movies or TV shows. Otherwise, I'll have to shut
                  everything down and then everyone will be sad. Thanks.
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
