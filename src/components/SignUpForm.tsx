import type { TurnstileInstance } from "@marsidev/react-turnstile";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PUBLIC_TURNSTILE_SITEKEY } from "@/config/client";
import { MAX_NAME_LENGTH, MIN_WAIT_TIME } from "@/config/constants";
import { sendVerificationEmail, signUp } from "@/lib/auth-clients";
import { minutesPassedSince } from "@/lib/utils";

const formSchema = z
  .object({
    email: z.email().toLowerCase(),
    name: z.string().max(MAX_NAME_LENGTH),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    passwordConfirm: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const [token, setToken] = useState<string>("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  // Form hook
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(formSchema),
  });

  // Submit handler
  function onSubmit(
    values: z.infer<typeof formSchema>,
    event?: React.BaseSyntheticEvent
  ) {
    // Prevent redirecting to /dashboard (since auto-login is enabled)
    event?.preventDefault();

    const { email, name, password } = values;

    // Rate-limit login attempts
    const minutesSince = minutesPassedSince(sentEmail);
    if (minutesSince < MIN_WAIT_TIME) {
      toast.warning(
        "Too many signup attempts, please wait and try again later."
      );
      return;
    }

    // Captcha token
    if (!token) {
      form.setError("root", { message: "Please verify captcha." });
      return;
    }

    signUp.email(
      {
        email,
        fetchOptions: {
          headers: {
            "x-captcha-response": token,
          },
        },
        name,
        password,
      },
      {
        // @ts-expect-error typing error
        onError: (ctx) => {
          const status = ctx.error.status;
          if (status === 422) {
            form.setError(
              "email",
              { message: "Email already exists." },
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
        onSuccess: () => {
          sendVerificationEmail({
            callbackURL: "/dashboard",
            email,
          });

          toast.success("Email sent! Check your inbox.", {
            closeButton: true,
            duration: 30000,
          });
          form.resetField("password");
          form.resetField("passwordConfirm");
          setSentEmail(new Date().toISOString());
          setLoading(false);
        },
      }
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[350px] flex-col">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Trial period will start after email verification. I recommend using
            an unblocked email
            <Popover>
              <PopoverTrigger>
                <span className="text-secondary-link ml-1 cursor-pointer underline">
                  provider
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-fit">
                <h1 className="font-2xl">Recommended</h1>
                <hr className="my-3" />
                <ul>
                  <li>qq.com</li>
                  <li>icloud.com</li>
                  <li>live.com</li>
                  <li>outlook.com</li>
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input placeholder="(optional)" {...field} />
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
                data-umami-event="signup"
              >
                Create account
              </Button>
            </form>
          </Form>
          <p className="text-muted-foreground pt-4 text-center text-xs">
            <a
              className="px-1"
              href="/privacy"
              target="_blank"
              rel="noreferrer"
            >
              Terms and conditions
            </a>
          </p>
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-sm">
        Already have an account?
        <a href="/login" className="text-primary-link ml-2 underline">
          Log in
        </a>
      </div>
    </div>
  );
}

export default SignUpForm;
