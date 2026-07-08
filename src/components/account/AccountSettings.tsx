import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { MAX_NAME_LENGTH } from "@/config/constants";
import type { UserDB } from "@/db/queries";
import { api, parseApi } from "@/lib/api-clients";

const formSchema = z.object({
  name: z.string().max(MAX_NAME_LENGTH),
});

interface Props {
  user: UserDB;
}

function AccountSettings({ user }: Props) {
  const [loading, setLoading] = useState(false);
  const { mutate } = useSWRConfig();

  // Handlers
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: user.name,
    },
    resolver: zodResolver(formSchema),
  });

  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = await parseApi(api.user.$patch, {
      json: { name: values.name },
    });

    if (result.ok) {
      mutate("fetchUser");
      toast.success("Info updated.");
    } else {
      toast.error("Failed to update, please try again later.");
    }
    setLoading(false);
  }

  return (
    <Card x-chunk="account settings">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <h1 className="font-semibold text-2xl">Personal Info</h1>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Nickname</FormLabel>
                  <FormControl>
                    <Input autoComplete="off" className="max-w-64" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <span className="flex text-muted-foreground">
              Call yourself whatever you like!
            </span>
            <Button disabled={loading} loading={loading} type="submit">
              Save
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default AccountSettings;
