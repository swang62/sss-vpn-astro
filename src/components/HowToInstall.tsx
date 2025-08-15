import type UAParser from "ua-parser-js";

import { CogIcon, Copy, Download, Menu, PartyPopper } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import type { Platform } from "@/config/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FILE_DOWNLOAD_URL, FILE_TYPES } from "@/config/constants";
import { fetchUser } from "@/lib/api-clients";
import { copyToClipboard, getHiddifyLinks } from "@/lib/utils";

import type { StepProps } from "./Step";

import Step from "./Step";

function getSteps(
  downloadFile: string,
  downloadIcon: string,
  links?: ReturnType<typeof getHiddifyLinks>,
): StepProps[] {
  const isMacOS = downloadFile.includes(".dmg");
  const isWindows = downloadFile.includes(".exe");
  const isIOS = downloadFile.includes(".ipa");
  const isAndroid = downloadFile.includes(".apk");

  const isMobile = isIOS || isAndroid;
  const imageWidth = 400;

  return [
    {
      content:
    <>
      <p>
        Click the button below to download the app manually
        {" "}
        {isIOS && (
          <>
            , or click
            <a href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532" target="_blank" rel="noreferrer" className="px-1 text-primary-link underline">here</a>
            to directly install from the App store. If successfully installed (may not work in China), skip directly to Step 3.
          </>
        )}
        {isAndroid && (
          <>
            , or click
            <a href="https://play.google.com/store/apps/details?id=app.hiddify.com&hl=en-us" target="_blank" rel="noreferrer" className="px-1 text-primary-link underline">here</a>
            to directly install from the Play store. If successfully installed (may not work in China), skip directly to Step 3.
          </>
        )}
      </p>
      <a href={`${FILE_DOWNLOAD_URL}${downloadFile}`} className="self-center pr-8">
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
          Navigate to where you downloaded the file and install it normally (usually by double-clicking).
          {isMobile && " Allow unknown sources and accept all permissions during installation."}
        </div>
        {isIOS && (
          <div className="flex flex-col gap-4">
            <p>
              There are 3 options to install from easiest to hardest:
            </p>
            <p>
              1) Visit this
              <a href="https://www.installonair.com" target="_blank" rel="noreferrer" className="px-1 text-primary-link underline">link</a>
              and upload the
              {" "}
              {downloadFile}
              {" "}
              file. You can now visit the generated link on your iPhone to install it through Safari.
            </p>
            <p>
              2) Install iTunes on your computer, connect your phone, and drag the
              {" "}
              {downloadFile}
              {" "}
              file to your phone to install.
            </p>
            <p>
              3) Install with a third-party app like FlexStore, AltStore, eSign or Bullfrog Assistant. You may need to look up guides online.
            </p>
          </div>
        )}
        {isMacOS && (
          <div className="text-foreground">
            For macOS, you will need download an extra shortcut file
            {" "}
            <a href={`${FILE_DOWNLOAD_URL}start_vpn.command`} className="text-primary-link underline">here</a>
            . Save this file to your desktop and open up the Terminal app.
            Type "sudo chmod +x ~/Desktop/start_vpn.command" into the terminal
            and hit enter. Enter your password (it will be invisible) and hit enter again.
            Then, close the terminal and use the desktop shortcut to launch the app from now on.
          </div>
        )}
        {isWindows && (
          <div className="text-foreground">
            If you get a warning during install, click on More Info &gt; Run Anyways.
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
              <>
                Open up the app using the desktop shortcut (or launch as administrator),
              </>
            )
          : isMacOS
            ? (
                <>
                  Open up the app by clicking the .command file,
                </>
              )
            : (
                <>
                  Open up the app,
                </>
              )}
        {" "}
        change the language to English and set the region to China, then click start.
        <br />
        <br />
        <img src="/setup/welcome-screen.png" width={imageWidth} alt="welcome screen" className="self-center" loading="lazy" />
        <br />
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
            <Copy className="size-4" />
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
        <div className="text-muted-foreground">Note: for monthly subscriptions, the days remaining will show infinity, but will reset each month.</div>
      </>,
      title: "Add your profile",
    },
    {
      content:
       <>
         <div>
           In the options panel
           <Menu className="mx-1 inline-block" />
           under Config Options (look for a
           <CogIcon className="mx-1 inline-block" />
           icon), set IPv6 Route to
           {" "}
           <b>Enable</b>
           ,
           {" "}
           Remote DNS to
           {" "}
           <b>udp://1.1.1.1</b>
           ,
           and Direct DNS to
           {" "}
           <b>local</b>
           .

         </div>
         <img src="/setup/dns-config.png" alt="dns" width={imageWidth / 1.5} className="self-center" loading="lazy" />
         {!isMobile && (
           <>
             <p>
               Scroll down and make sure the service mode is set to
               {" "}
               <b>VPN</b>
               .
             </p>
             <img src="/setup/service-mode.png" alt="dns" width={imageWidth / 1.5} className="self-center" loading="lazy" />
           </>
         )}

       </>,
      title: "Configuration",
    },
    {
      content:
      <>
        <p>
          Go back to the home screen and tap the giant button in the middle and you should be connected!
          {" "}
          {isMobile && (
            <>
              You should see a key or VPN icon in the top status bar.
            </>
          )}
        </p>
        <br />
        <img src="/setup/connected.png" width={imageWidth} alt="connected" className="self-center" loading="lazy" />
      </>,
      title: (
        <div className="flex flex-nowrap">
          All done!
          <PartyPopper className="size-4 ml-2 text-orange-400" />
        </div>
      ),
    },
    {
      content:
      <>
        <div>
          If all is working, feel free to upgrade your plan to a single month, or a monthly subscription
          {" "}
          <a href="/dashboard/pricing" className="text-primary-link underline">here</a>
          .
          {" "}
          I also recommend visiting
          {" "}
          <a href="/dashboard/tips" className="text-primary-link underline">Tips & Tricks</a>
          {" "}
          to learn more about optimizing your speeds and general troubleshooting.
        </div>
      </>,
      title: "Next steps",
    },
  ];
};

interface Props {
  device: UAParser.IDevice["type"];
  os?: string;
}

function getPlatform(props: Props): Platform {
  if (!props.device) {
    // Is desktop
    if (props.os === "macOS") {
      return "mac";
    } else {
      return "pc";
    }
  } else {
    // Is mobile
    if (props.os === "iOS") {
      return "ios";
    } else {
      return "android";
    }
  }
}

function HowToInstall(props: Props) {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const { data, mutate } = useSWR("fetchUser", fetchUser);
  const user = data?.user;
  const profile = user?.profile;
  const links = profile ? getHiddifyLinks(user.email, profile.hiddifyId, profile.hiddifyServerId) : undefined;
  const platform = getPlatform(props);

  // Poll for hiddify profile creation
  useEffect(() => {
    if (!profile?.hiddifyId) {
      setIntervalId(setInterval(async () => {
        const data = await mutate();
        if (data?.user?.profile?.hiddifyId) {
          clearInterval(intervalId);
        }
      }, 2000));
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [profile?.hiddifyId]);

  return (
    <Tabs defaultValue={platform}>
      <TabsList className="grid w-full grid-cols-4 h-10 mb-8 bg-slate-400 dark:bg-slate-800">
        <TabsTrigger value="android">
          <img width="20" height="20" src={FILE_TYPES.android.icon} alt="android" loading="eager" />
          <span className="ml-1">Android</span>
        </TabsTrigger>
        <TabsTrigger value="ios">
          <img width="20" height="20" src={FILE_TYPES.ios.icon} alt="ios" loading="eager" />
          <span className="ml-1">iOS</span>
        </TabsTrigger>
        <TabsTrigger value="pc">
          <img width="20" height="20" src={FILE_TYPES.pc.icon} alt="pc" loading="eager" />
          <span className="ml-1">PC</span>
        </TabsTrigger>
        <TabsTrigger value="mac">
          <img width="20" height="20" src={FILE_TYPES.mac.icon} alt="mac" loading="eager" />
          <span className="ml-1">Mac</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="android">
        {getSteps(FILE_TYPES.android.fileType, FILE_TYPES.android.icon, links)
          .map((step, idx) => <Step key={idx} content={step.content} title={step.title} idx={idx} />)}
      </TabsContent>
      <TabsContent value="pc">
        {getSteps(FILE_TYPES.pc.fileType, FILE_TYPES.pc.icon, links)
          .map((step, idx) => <Step key={idx} content={step.content} title={step.title} idx={idx} />)}
      </TabsContent>
      <TabsContent value="ios">
        {getSteps(FILE_TYPES.ios.fileType, FILE_TYPES.ios.icon, links)
          .map((step, idx) => <Step key={idx} content={step.content} title={step.title} idx={idx} />)}
      </TabsContent>
      <TabsContent value="mac">
        {getSteps(FILE_TYPES.mac.fileType, FILE_TYPES.mac.icon, links)
          .map((step, idx) => <Step key={idx} content={step.content} title={step.title} idx={idx} />)}
      </TabsContent>
    </Tabs>
  );
}

export default HowToInstall;
