import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { z } from "zod";

import type { UserDB } from "@/db/queries";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MAX_NAME_LENGTH } from "@/config/constants";
import { apiClient, parseApi } from "@/lib/api-clients";

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
    const { error } = await parseApi(
      apiClient.user.$patch({ json: { name: values.name } }),
    );

    if (!error) {
      mutate("fetchUser");
      toast.success("Info updated.");
    } else {
      toast.error("Failed to update, please try again later.");
    }
    setLoading(false);
  };

  return (
    <Card x-chunk="account settings">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CardHeader>
            <h1 className="text-2xl font-semibold">Personal Info</h1>
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
          <CardFooter className="justify-between gap-4 py-4 border-t bg-muted">
            <span className="flex text-muted-foreground">
              Feel free to call yourself whatever you like :)
            </span>
            <Button
              disabled={loading}
              loading={loading}
              type="submit"
            >
              <span>Save</span>
            </Button>
          </CardFooter>

        </form>
      </Form>
    </Card>

  );
}

export default AccountSettings;
