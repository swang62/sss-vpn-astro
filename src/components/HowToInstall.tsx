import type UAParser from "ua-parser-js";

import { CogIcon, Copy, Download, Menu, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HIDDIFY_DOWNLOAD_URL } from "@/config/constants";
import { fetchUser } from "@/lib/api-clients";
import { copyToClipboard, getHiddifyLinks } from "@/lib/utils";

import type { StepProps } from "./Step";

import Step from "./Step";

function getSteps(
  platform: "mobile" | "desktop",
  downloadFile: string,
  downloadIcon: string,
  links?: ReturnType<typeof getHiddifyLinks>,
): StepProps[] {
  const isMacOS = downloadFile.includes(".dmg");
  const isWindows = downloadFile.includes(".exe");
  const isIOS = downloadFile.includes(".ipa");

  const isMobile = platform === "mobile";
  const imageWidth = 400;

  return [
    {
      content:
    <>
      <p>
        Click the button below to download the app.
        {" "}
        {isIOS && (
          <>
            Or better, click this
            <a href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532" target="_blank" rel="noreferrer" className="px-1 text-primary-link underline">link</a>
            to directly install from the App store. The app store may or may not work in China.
          </>
        )}
      </p>
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
          file and double-click to install
          {isIOS && " (skip to Step 3 if you installed through the App store)"}
          .
          {isMobile && " You may need to allow all permissions."}
        </div>
        {isIOS && (
          <div className="flex flex-col gap-4">
            <p>
              There are 2 options to install from easiest to hardest:
            </p>
            <p>
              1) Install iTunes on your computer, connect your phone, and drag the
              {" "}
              {downloadFile}
              {" "}
              file to your phone's Apps folder to install.
            </p>
            <p>
              2) Install an app like eSign or Bullfrog Assistant. Find the sign/install app locally option, browse to the
              {" "}
              {downloadFile}
              {" "}
              file and install. You may need to look up guides online.
            </p>
          </div>
        )}
        {isMacOS && (
          <div className="text-foreground">
            For macOS, you will need download an extra file
            {" "}
            <a href={`${HIDDIFY_DOWNLOAD_URL}start_vpn.command`} className="text-primary-link underline">here</a>
            . Save this file to your desktop and open up your Terminal app using spotlight.
            Copy "sudo chmod +x ~/Desktop/start_vpn.command" into the terminal
            and hit enter. Enter your password (it will be invisible) and hit enter again.
            Then close the terminal and double-click the file to launch the Hiddify VPN app.
          </div>
        )}
        {isWindows && (
          <div className="text-muted-foreground">
            Note: for windows, you might get a warning during install, just click on More Info &gt; Run Anyways. The warning message at the end is normal.
          </div>
        )}
      </>,
      title: "Install",
    },
    {
      content:
      <>
        {isWindows
          ? (
              <div>
                Open up the app using the desktop shortcut (or launch as administrator), and you should see the following screen:
              </div>
            )
          : isMacOS
            ? (
                <div>
                  Open up the app by clicking the .command file from the previous step, and you should see the following screen:
                </div>
              )
            : (
                <div>
                  Open up the app, and you should see the following screen:
                </div>
              )}
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
          <Input defaultValue={links?.url || "Loading..."} readOnly className="bg-muted text-muted-foreground" />
          <Button size="sm" onClick={() => copyToClipboard(links?.url || "")}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <div>
          Go back to the app and click on the
          <Badge variant="outline" className="mx-1 text-muted-foreground bg-muted">+ New Profile</Badge>
          button in the center of the screen. A popup should appear:
        </div>
        <br />
        <img src="/setup/add-profile.png" width={imageWidth} alt="add profile screen" className="self-center" loading="lazy" />
        <br />
        <div>
          Click
          <Badge variant="outline" className="mx-1 text-muted-foreground bg-muted">Add from clipboard</Badge>
          and you should see your profile added to the top.
        </div>
        <br />
        <img src="/setup/start-screen.png" width={imageWidth} alt="start screen" className="self-center" loading="lazy" />
        <br />
        <div className="text-muted-foreground">Note: for monthly subscriptions, the billing cycle will show infinity, but will still reset each month.</div>
      </>,
      title: "Add your profile",
    },
    {
      content:
       <>
         <div>
           In the options panel
           <Menu className="ml-1 inline-block" />
           , under Config Options (or search for a
           <CogIcon className="mx-1 inline-block" />
           icon), set IPv6 Route to 'Enable' and Direct DNS to
           {" "}
           {isWindows ? "'udp://1.1.1.1'." : "'local'."}
           {" "}
           You can just type it in if you can't find the option.
         </div>
         <img src="/setup/dns-config.png" alt="dns" width={imageWidth / 1.5} className="self-center" loading="lazy" />
         {!isMobile && (
           <>
             <p>Confirm the service mode is set to 'VPN'.</p>
             <img src="/setup/service-mode.png" alt="dns" width={imageWidth / 1.5} className="self-center" loading="lazy" />
           </>
         )}

       </>,
      title: "Final steps",
    },
    {
      content:
      <>
        <div>
          Go back to the home screen and tap the giant button in the middle and you should be connected! Press
          <Badge variant="outline" className="mx-1 text-muted-foreground bg-muted">Check IP</Badge>
          to confirm your new IP address is
          {" "}
          {links?.ip}
        </div>
        <br />
        <img src="/setup/connected.png" width={imageWidth} alt="connected" className="self-center" loading="lazy" />
        <br />
        {isWindows && (
          <div className="text-muted-foreground">
            Note: on Windows, if there's no internet, try changing Direct DNS to 8.8.8.8, tcp://1.1.1.1, or local. It all depends on your specific computer setup, just try each one in turn.
          </div>
        )}
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
          <a href="/dashboard/tips" className="text-primary-link underline">Tips & Tricks</a>
          {" "}
          page to learn more about optimizing your speeds and general troubleshooting.
        </div>
      </>,
      title: "Optional next steps",
    },
  ];
};

interface Props {
  device: UAParser.IDevice["type"];
  os?: string;
}

function HowToInstall({ device, os }: Props) {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const { data, mutate } = useSWR("fetchUser", fetchUser);
  const user = data?.user;
  const profile = user?.profile;
  const links = profile ? getHiddifyLinks(user.email, profile.hiddifyId, profile.hiddifyServerId) : undefined;

  const defaultTab = !device ? "desktop" : "mobile";

  const isApple = os === "macOS" || os === "iOS";
  const mobileFile = isApple ? "Hiddify.ipa" : "Hiddify.apk";
  const desktopFile = isApple ? "Hiddify.dmg" : "Hiddify.exe";

  const mobileIcon = isApple ? "/setup/ios.png" : "/setup/google-play.png";
  const desktopIcon = isApple ? "/setup/mac.png" : "/setup/microsoft.png";

  useEffect(() => {
    if (!profile?.hiddifyId) {
      setIntervalId(setInterval(mutate, 2000));
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [profile?.hiddifyId]);

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="mobile">Mobile</TabsTrigger>
        <TabsTrigger value="desktop">Desktop</TabsTrigger>
      </TabsList>
      <TabsContent value="mobile">
        {getSteps("mobile", mobileFile, mobileIcon, links)
          .map((step, idx) => <Step key={idx} content={step.content} title={step.title} idx={idx} />)}
      </TabsContent>
      <TabsContent value="desktop">
        {getSteps("desktop", desktopFile, desktopIcon, links)
          .map((step, idx) => <Step key={idx} content={step.content} title={step.title} idx={idx} />)}
      </TabsContent>
    </Tabs>
  );
}

export default HowToInstall;
