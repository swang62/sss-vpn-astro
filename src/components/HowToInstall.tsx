import type UAParser from "ua-parser-js";

import { Copy, Download, PartyPopper } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HIDDIFY_DOWNLOAD_URL } from "@/config/constants";
import { copyToClipboard } from "@/lib/utils";

import type { StepProps } from "./Step";

import Step from "./Step";

const imageWidth = 400;

function getSteps(
  platform: "mobile" | "desktop",
  downloadFile: string,
  downloadIcon: string,
  url: string,
): StepProps[] {
  const isMobile = platform === "mobile";
  const isMacOS = downloadFile.includes(".dmg");
  const isWindows = downloadFile.includes(".exe");
  const isIOS = downloadFile.includes(".ipa");

  return [
    {
      content:
    <>
      <p>Click the button below to download the app.</p>
      <a href={`${HIDDIFY_DOWNLOAD_URL}${downloadFile}`} className="self-center pr-8">
        <Button>
          <Download />
          Download for
          <img width="20" height="20" src={downloadIcon} alt="Download icon" loading="eager" />
        </Button>
      </a>
    </>,
      title: "Download",
    },
    {
      content:
      <>
        <div>
          Navigate to where you downloaded the
          {" "}
          <u>{downloadFile}</u>
          {" "}
          file and double-click to install.
          {isMobile && " You may have to allow install from unknown sources and accept all permissions."}
        </div>
        {isIOS && (
          <div className="text-muted-foreground">
            Note: for iOS/iPhone, the process is a little bit trickier. There are 2 options: 1)
            You will need to install iTunes on your Mac/PC, then connect your phone, and drag the
            .ipa file to your phone's Apps folder when it pops up. 2) Install another app like eSign,
            bullfrog assistant, flekstore, and install the file through that. You will need to look up
            guides for whichever one you choose. Unfortunately, Apple is extremely protective of their App store
            and will not allow software like this VPN.
          </div>
        )}
        {isMacOS && (
          <div className="text-muted-foreground">
            Note: for macOS, you will need download an extra file
            {" "}
            <a href={`${HIDDIFY_DOWNLOAD_URL}start_hiddify_vpn.command`} className="text-primary-link">here</a>
            {" "}
            after installing the app.
            {" "}
            Save this file to your desktop and double-click it to launch Hiddify instead of the usual way.
          </div>
        )}
        {isWindows && (
          <div className="text-muted-foreground">
            Note: for windows, you might get a warning during install, just click on More Info and Run Anyways. Always use the desktop shortcut to launch Hiddify.
          </div>
        )}
      </>,
      title: "Install",
    },
    {
      content:
      <>
        <div>
          Open up the app, and you should see the following screen:
        </div>
        <br />
        <img src="/setup/welcome-screen.png" width={imageWidth} alt="welcome screen" className="self-center" loading="lazy" />
        <br />
        <div>Change the language to English for now and set the region to China, then click Start.</div>
      </>,
      title: "Initial setup",
    },
    {
      content:
      <>
        <div>First, copy your unique profile link:</div>
        <div className="flex items-center gap-2">
          <Input defaultValue={url} readOnly className="bg-muted text-muted-foreground" />
          <Button size="sm" onClick={() => copyToClipboard(url)}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div>
          Go back to the app and click on the
          <Badge variant="outline" className="mx-2 text-muted-foreground bg-muted">+ New Profile</Badge>
          button in the center of the screen. A popup should appear:
        </div>
        <br />
        <img src="/setup/add-profile.png" width={imageWidth} alt="add profile screen" className="self-center" loading="lazy" />
        <br />
        <div>
          Click
          <Badge variant="outline" className="mx-2 text-muted-foreground bg-muted">Add from clipboard</Badge>
          and you should see your profile added to the top.
        </div>
        <br />
        <img src="/setup/start-screen.png" width={imageWidth} alt="start screen" className="self-center" loading="lazy" />
        <br />
        <div className="text-muted-foreground">Note: for monthly subscriptions, the billing cycle will show infinity but will still reset each month.</div>
      </>,
      title: "Add your profile",
    },
    {
      content:
      <>
        <div>
          Tap the giant button in the middle and you should be connected!
        </div>
        {isWindows && (
          <div className="text-muted-foreground">
            Note: if your internet is disconnected in windows, go to Config Options in the left side panel.
            Scroll down and find Direct DNS and make sure it's set to udp://1.1.1.1 or 8.8.8.8
          </div>
        )}
        <br />
        <img src="/setup/connected.png" width={imageWidth} alt="connected" className="self-center" loading="lazy" />
        <br />
        {isMobile && (
          <div>
            You should see a key icon in the top right corner.
            A new notification will also appear showing your connection speed.
          </div>
        )}
      </>,
      title: (
        <div className="flex flex-nowrap">
          All done!
          <PartyPopper className="ml-2 text-orange-400" />
        </div>
      ),
    },
    {
      content:
      <>
        <div>
          Although not strictly necessary, I recommend visiting the
          {" "}
          <a href="/dashboard/tips" className="text-primary-link">Tips & Tricks</a>
          {" "}
          page to maximize your speeds and general troubleshooting.
        </div>
      </>,
      title: "Optional final steps",
    },
  ];
};

interface Props {
  device: UAParser.IDevice["type"];
  os?: string;
  url: string;
}

function HowToInstall({ device, os, url }: Props) {
  const defaultTab = !device ? "desktop" : "mobile";

  const isApple = os === "macOS" || os === "iOS";
  const mobileFile = isApple ? "Hiddify.ipa" : "Hiddify.apk";
  const desktopFile = isApple ? "Hiddify.dmg" : "Hiddify.exe";

  const mobileIcon = isApple ? "/setup/ios.png" : "/setup/google-play.png";
  const desktopIcon = isApple ? "/setup/mac.png" : "/setup/microsoft.png";

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="mobile">Mobile</TabsTrigger>
        <TabsTrigger value="desktop">Desktop</TabsTrigger>
      </TabsList>
      <TabsContent value="mobile">
        {getSteps("mobile", mobileFile, mobileIcon, url)
          .map((step, idx) => <Step key={idx} content={step.content} title={step.title} idx={idx} />)}
      </TabsContent>
      <TabsContent value="desktop">
        {getSteps("desktop", desktopFile, desktopIcon, url)
          .map((step, idx) => <Step key={idx} content={step.content} title={step.title} idx={idx} />)}
      </TabsContent>
    </Tabs>
  );
}

export default HowToInstall;
