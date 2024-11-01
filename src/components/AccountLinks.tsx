import { Copy } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchUser } from "@/lib/api-clients";
import { copyToClipboard, getHiddifyLink, getHiddifyQR } from "@/lib/utils";

interface Props {}

function AccountLinks(_props: Props) {
  const [url, setUrl] = useState("");
  const [qrcode, setQrcode] = useState("");
  const { data } = useSWR("fetchUser", fetchUser);
  const user = data?.user;
  const profile = user?.profile;

  useEffect(() => {
    if (!user || !profile) return;

    setUrl(getHiddifyLink(user.email, profile.hiddifyId));
    getHiddifyQR(user.email, profile.hiddifyId).then(qrcode => setQrcode(qrcode));
  }, [profile?.hiddifyId]);

  return (
    <Card x-chunk="Plan links">
      <CardHeader>
        <CardTitle>Useful links</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <p>
          This is your unique profile link used to add your profile to the VPN Hiddify app. Assuming you've
          {" "}
          <a href="/dashboard/install">installed</a>
          {" "}
          it once already, you can use this for future setups.
        </p>
        <div className="flex items-center gap-2 my-6">
          <Input defaultValue={url} readOnly className="bg-muted/40 text-muted-foreground" />
          <Button onClick={() => copyToClipboard(url)}>
            <Copy className="w-4 h-4" />
            Copy
          </Button>
        </div>

        <img src={qrcode} width={200} height={200} alt="QR Code" className="self-center" />

        <p className="mt-1 text-center text-muted-foreground">
          For mobile-only
        </p>
      </CardContent>
    </Card>
  );
}

export default AccountLinks;
