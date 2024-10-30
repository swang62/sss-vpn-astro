import type UAParser from "ua-parser-js";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { copyToClipboard } from "@/lib/utils";

import type { StepProps } from "./Step";

import Step from "./Step";

interface Props {
  device: UAParser.IDevice["type"];
  os?: string;
  qrcode: string;
  url: string;
}

function HowToInstall({ device, os, qrcode, url }: Props) {
  const stepsForMobile: StepProps[] = [
    {
      content: <img src={qrcode} width="200" height="200" alt="Hiddify QR Code" className="self-center" />,
      title: "test",
    },
    {
      content:
        <>
          <div>{device}</div>
          <div>{os}</div>
        </>,
      title: "test",
    },
    {
      content: (
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Setup link
            </Label>
            <Input
              id="link"
              defaultValue={url}
              readOnly
            />
          </div>
          <Button size="sm" className="px-3" onClick={() => copyToClipboard(url)}>
            <span className="sr-only">Copy</span>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      ),
      title: "Configuration",
    },
  ];

  const tabStyle = "flex flex-col gap-6 py-4";

  return (
    <Tabs defaultValue="mobile">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="mobile">Mobile</TabsTrigger>
        <TabsTrigger value="desktop">Desktop</TabsTrigger>
      </TabsList>
      <TabsContent value="mobile" className={tabStyle}>
        {stepsForMobile.map((step, idx) => <Step key={idx} {...step} step={idx + 1} />)}
      </TabsContent>
      <TabsContent value="desktop" className={tabStyle}>
      </TabsContent>
    </Tabs>
  );
}

export default HowToInstall;
