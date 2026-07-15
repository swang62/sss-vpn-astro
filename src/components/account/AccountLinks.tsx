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

    const setupLink = getHiddifyLinks(user.email, profile.hiddifyId);

    setUrl(setupLink);
    QRCode.toDataURL(setupLink)
      .then((qrcode) => setQrcode(qrcode))
      .catch((error) => {
        captureException(error);
        setQrcode("");
      });
  }, [profile?.hiddifyId]);

  const altUrl = url.replace("/#", "/sub/#");

  return (
    <Card x-chunk="Plan links">
      <CardHeader>
        <div className="flex items-center gap-2">
          {/*<Link2 className="size-5 text-primary" />*/}
          <CardTitle className="translate-y-px font-heading">
            Useful links
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          Your unique subscription link for setting up new devices in{" "}
          <a
            href="/dashboard/install"
            className="font-medium text-primary-link underline underline-offset-2"
          >
            Hiddify
          </a>
          . You can also scan the QR code on mobile devices.
        </p>

        <div className="flex items-center gap-2">
          <Input
            defaultValue={url}
            readOnly
            className="bg-muted/40 font-mono text-muted-foreground text-xs"
          />
          <Button
            size="sm"
            onClick={() => copyToClipboard(url)}
            className="shrink-0 gap-1.5"
          >
            <Copy className="size-3.5" />
            Copy
          </Button>
        </div>
        <div className="flex justify-center">
          {qrcode ? (
            <img
              src={qrcode}
              width={160}
              height={160}
              alt="QR Code"
              className="rounded-lg border border-border"
              loading="lazy"
            />
          ) : (
            <div className="h-40 w-40 animate-pulse rounded-lg bg-muted" />
          )}
        </div>
        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
          <p className="font-mono text-[11px] text-muted-foreground leading-relaxed tracking-wider">
            For Shadowrocket, V2Ray, or Xray clients, use this link instead:
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Input
              defaultValue={altUrl}
              readOnly
              className="bg-muted/40 font-mono text-muted-foreground text-xs"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(altUrl)}
              className="shrink-0 gap-1.5"
            >
              <Copy className="size-3.5" />
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AccountLinks;
