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
import { PasswordInput } from "@/components/ui/password-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  .refine(data => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

interface Props {}

function SignUpForm(_props: Props) {
  const [loading, setLoading] = useState(false);
  const [sentEmail, setSentEmail] = useState("");

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
  function onSubmit(values: z.infer<typeof formSchema>, event?: React.BaseSyntheticEvent) {
    event?.preventDefault();

    const minutesSince = minutesPassedSince(sentEmail);
    if (minutesSince < MIN_WAIT_TIME) {
      toast.warning("Too many signup attempts, please wait and try again later.");
      return;
    }

    const { email, name, password } = values;
    signUp.email(
      {
        email,
        name,
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
          form.resetField("password");
          form.resetField("passwordConfirm");
          setSentEmail(new Date().toISOString());
          setLoading(false);
        },
      },
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Trial period will start after email verification.
          <br />
          If in China, use an unblocked email
          <Popover>
            <PopoverTrigger>
              <span className="ml-1 underline text-secondary-link">
                provider
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <h1 className="font-2xl">Recommended Emails</h1>
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

            <Button className="w-full" type="submit" loading={loading} disabled={loading}>
              Create account
            </Button>
          </form>
        </Form>

        <div className="mt-4 text-sm text-center">
          Already have an account?
          <a
            href="/login"
            className="ml-2 underline text-primary-link"
          >
            Log in
          </a>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-xs text-center text-muted-foreground">
            Terms and conditions
            <a className="px-1 text-foreground" href="/privacy" target="_blank" rel="noreferrer">here</a>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}

export default SignUpForm;
