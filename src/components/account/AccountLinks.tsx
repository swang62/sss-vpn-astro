import { captureException } from "@sentry/astro";
import { Copy } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchUser } from "@/lib/api-clients";
import { copyToClipboard, getHiddifyLinks } from "@/lib/utils";

function AccountLinks() {
  const [url, setUrl] = useState("Loading...");
  const [qrcode, setQrcode] = useState<string>();
  const { data } = useSWR("fetchUser", fetchUser);
  const user = data?.user;
  const profile = user?.profile;

  useEffect(() => {
    if (!user || !profile) return;

    const setupLink = getHiddifyLinks(
      user.email,
      profile.hiddifyId,
      profile.hiddifyServerId
    );

    setUrl(setupLink);
    QRCode.toDataURL(setupLink)
      .then((qrcode) => setQrcode(qrcode))
      .catch((error) => {
        captureException(error);
        setQrcode("");
      });
  }, [profile?.hiddifyId]);

  return (
    <Card x-chunk="Plan links">
      <CardHeader>
        <CardTitle>Useful Links</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <p>
          This is your unique subscription link to{" "}
          <a href="/dashboard/install" className="text-primary-link underline">
            setup
          </a>{" "}
          new devices.
        </p>
        <div className="flex items-center gap-2 py-4">
          <Input
            defaultValue={url}
            readOnly
            className="bg-muted/40 text-muted-foreground"
          />
          <Button onClick={() => copyToClipboard(url)}>
            <Copy className="size-4" />
            Copy
          </Button>
        </div>

        <img
          src={qrcode}
          width={200}
          height={200}
          alt="QR Code"
          className="self-center"
          loading="lazy"
        />
      </CardContent>
    </Card>
  );
}

export default AccountLinks;
