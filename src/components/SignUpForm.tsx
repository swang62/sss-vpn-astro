import { zodResolver } from "@hookform/resolvers/zod";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Turnstile } from "@marsidev/react-turnstile";
import { ShieldCheck } from "lucide-react";
import { useRef, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PUBLIC_TURNSTILE_SITEKEY } from "@/config/client";
import { MAX_NAME_LENGTH, MIN_WAIT_TIME } from "@/config/constants";
import { sendVerificationEmail, signUp } from "@/lib/auth-clients";
import { secondsSince } from "@/lib/utils";

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
  const turnstileRef = useRef<TurnstileInstance>(null);
  const [captchaVerifying, setCaptchaVerifying] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
      passwordConfirm: "",
    },
    resolver: zodResolver(formSchema),
  });

  function onSubmit(
    values: z.infer<typeof formSchema>,
    event?: React.BaseSyntheticEvent
  ) {
    event?.preventDefault();

    const { email, name, password } = values;

    if (!token) {
      form.setError("root", { message: "Please verify captcha." });
      return;
    }

    const waitTime = secondsSince(sentEmail);
    if (waitTime < MIN_WAIT_TIME) {
      toast.warning(
        "Too many signup attempts, please wait a sec before trying again."
      );
      return;
    }

    signUp.email(
      {
        email,
        name,
        password,
        fetchOptions: {
          headers: { "x-captcha-response": token },
        },
      },
      {
        // @ts-expect-error bad typing from betterauth
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
          setToken("");
          setLoading(false);
        },
        onRequest: () => setLoading(true),
        onSuccess: () => {
          sendVerificationEmail({ callbackURL: "/dashboard", email });
          toast.success("Email sent! Check your inbox.");
          form.resetField("password");
          form.resetField("passwordConfirm");
          setSentEmail(new Date().toISOString());
          setLoading(false);
        },
      }
    );
  }

  return (
    <>
      <h2 className="mb-2 text-center font-heading text-2xl">
        Create an account
      </h2>
      <p className="mt-2 mb-4 text-center font-mono text-muted-foreground text-xs tracking-wider md:mb-6">
        Trial starts after verification. Use an unblocked email{" "}
        <Popover>
          <PopoverTrigger className="cursor-pointer text-secondary-link underline">
            provider
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <ul>
              <li>qq.com</li>
              <li>163.com</li>
              <li>icloud.com</li>
              <li>live.com</li>
              <li>outlook.com</li>
            </ul>
          </PopoverContent>
        </Popover>
      </p>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono text-xs tracking-widest">
                  Nickname
                </FormLabel>
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

          <div className="rounded-lg border border-border bg-card px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className={`size-5 transition-all duration-700 ${
                    token
                      ? "text-secondary"
                      : captchaVerifying
                        ? "animate-pulse text-primary"
                        : "text-muted-foreground"
                  }`}
                />
                <span className="font-mono text-muted-foreground text-xs tracking-wider">
                  {token
                    ? "Verified"
                    : captchaVerifying
                      ? "Verifying..."
                      : "Security check"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] text-muted-foreground tracking-widest">
                  CAPTCHA
                </span>
              </div>
            </div>

            <Turnstile
              ref={turnstileRef}
              siteKey={PUBLIC_TURNSTILE_SITEKEY}
              options={{
                appearance: "interaction-only",
                size: "flexible",
              }}
              onSuccess={(t) => {
                setToken(t);
                setCaptchaVerifying(false);
              }}
              onExpire={() => {
                setToken("");
                setCaptchaVerifying(true);
              }}
              onBeforeInteractive={() => setCaptchaVerifying(false)}
            />
          </div>
          <FormMessage className="text-center">
            {form.formState.errors.root?.message}
          </FormMessage>

          <Button
            className="w-full font-mono tracking-widest"
            type="submit"
            loading={loading}
            disabled={loading || (captchaVerifying && !token)}
            data-umami-event="signup"
          >
            Create account
          </Button>
        </form>
      </Form>
      <p className="pt-6 text-center font-mono text-muted-foreground text-xs tracking-wider">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-semibold text-secondary-link transition-colors hover:text-secondary"
        >
          Log in
        </a>
      </p>
    </>
  );
}

export default SignUpForm;
