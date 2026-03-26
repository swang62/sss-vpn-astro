import type UAParser from "ua-parser-js";

import {
  Copy,
  Download,
  EllipsisVertical,
  PartyPopper,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import type { Platform } from "@/config/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FILE_CONFIG_JSON,
  FILE_DOWNLOAD_URL,
  FILE_START_COMMAND,
  FILE_TYPES,
} from "@/config/constants";
import { axiosFetch, fetchUser } from "@/lib/api-clients";
import { copyToClipboard, getHiddifyLinks, retryOnError } from "@/lib/utils";

import type { StepProps } from "./Step";

import Step from "./Step";

function getSteps(
  downloadFile: string,
  downloadIcon: string,
  setupLink?: string,
  config?: string
): StepProps[] {
  const isMacOS = downloadFile.includes(".dmg");
  const isWindows = downloadFile.includes(".exe");
  const isIOS = downloadFile.includes(".ipa");
  const isAndroid = downloadFile.includes(".apk");

  const isMobile = isIOS || isAndroid;
  const imageWidth = 400;

  return [
    {
      content: (
        <>
          <p>
            Click the button below to download the app manually
            {isIOS && (
              <>
                , or click
                <a
                  href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-link px-1 underline"
                >
                  here
                </a>
                to directly install from the App store. If successfully
                installed (may not work in China), skip directly to Step 3.
              </>
            )}
            {isAndroid && (
              <>
                , or click
                <a
                  href="https://play.google.com/store/apps/details?id=app.hiddify.com&hl=en-us"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-link px-1 underline"
                >
                  here
                </a>
                to directly install from the Play store. If successfully
                installed (may not work in China), skip directly to Step 3.
              </>
            )}
          </p>
          <a
            href={`${FILE_DOWNLOAD_URL}${downloadFile}`}
            className="self-center pr-8"
          >
            <Button data-umami-event="download-app">
              <Download />
              Download for
              <img
                width="20"
                height="20"
                src={downloadIcon}
                alt="Download icon"
                loading="eager"
              />
            </Button>
          </a>
        </>
      ),
      title: "Download",
    },
    {
      content: (
        <>
          <div>
            Navigate to where you downloaded the file and install it normally
            (usually by double-clicking).
            {isMobile &&
              " Allow unknown sources and accept all permissions during installation."}
          </div>
          {isIOS && (
            <div className="flex flex-col gap-4">
              <p>There are 3 options to install from easiest to hardest:</p>
              <p>
                1) Visit this
                <a
                  href="https://www.installonair.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-link px-1 underline"
                >
                  link
                </a>
                and upload the {downloadFile} file. You can now visit the
                generated link on your iPhone to install it through Safari.
              </p>
              <p>
                2) Install iTunes on your computer, connect your phone, and drag
                the {downloadFile} file to your phone to install.
              </p>
              <p>
                3) Install with a third-party app like FlexStore, AltStore,
                eSign or Bullfrog Assistant. You can look up guides online.
              </p>
            </div>
          )}
          {isMacOS && (
            <div className="text-foreground">
              For macOS, you will need download an extra shortcut file{" "}
              <a
                href={`${FILE_DOWNLOAD_URL}${FILE_START_COMMAND}`}
                className="text-primary-link underline"
              >
                here
              </a>
              . Save this file to your desktop and open up the Terminal app.
              Type "sudo chmod +x ~/Desktop/{FILE_START_COMMAND}" into the
              terminal and hit enter. Enter your password (it will be invisible)
              and hit enter. From now on, only use the desktop shortcut to
              launch the app.
            </div>
          )}
          {isWindows && (
            <div className="text-foreground">
              If you get a warning during install, click on More Info &gt; Run
              Anyways. It might give you an error after finishing installation,
              that's expected.
            </div>
          )}
        </>
      ),
      title: "Install",
    },
    {
      content: (
        <>
          {isWindows ? (
            <>
              Open up the app using the desktop shortcut (or launch as
              administrator),
            </>
          ) : isMacOS ? (
            <>Open up the app by clicking the {FILE_START_COMMAND} file,</>
          ) : (
            <>Open up the app,</>
          )}{" "}
          set the language to English and region to China/CN.
          <br />
          <br />
          <img
            src="/setup/welcome-screen.png"
            width={imageWidth}
            alt="welcome screen"
            className="self-center"
            loading="eager"
          />
          <br />
        </>
      ),
      title: "Initial setup",
    },
    {
      content: (
        <>
          <div>First, copy your unique subscription link below:</div>
          <div className="flex items-center gap-2">
            <Input
              defaultValue={setupLink || "Loading..."}
              readOnly
              className="bg-muted text-muted-foreground"
            />
            <Button onClick={() => copyToClipboard(setupLink || "")}>
              <Copy className="size-4" />
              Copy
            </Button>
          </div>
          <div>
            Go back to the app and click on the
            <Badge
              variant="outline"
              className="text-muted-foreground bg-muted mx-1"
            >
              + New Profile
            </Badge>
            button in the center of the screen. A popup should appear:
          </div>
          <br />
          <img
            src="/setup/add-profile.png"
            width={imageWidth}
            alt="add profile screen"
            className="self-center"
            loading="eager"
          />
          <br />
          <div>
            Click
            <Badge
              variant="outline"
              className="text-muted-foreground bg-muted mx-1"
            >
              Add from clipboard
            </Badge>
            and you should see your profile added to the top.
          </div>
          <br />
          <img
            src="/setup/start-screen.png"
            width={imageWidth}
            alt="start screen"
            className="self-center"
            loading="eager"
          />
          <br />
          <div className="text-muted-foreground">
            Note: for monthly subscriptions, the days remaining will show
            infinity. This is normal, it will self-reset each month.
          </div>
        </>
      ),
      title: "Add profile",
    },
    {
      content: (
        <>
          <div>Next, copy the settings below:</div>
          <div className="flex items-center gap-2">
            <Input
              defaultValue={config || "Loading..."}
              readOnly
              className="bg-muted text-muted-foreground"
            />
            <Button onClick={() => copyToClipboard(config || "")}>
              <Copy className="size-4" />
              Copy
            </Button>
          </div>
          <div>
            Find and click the
            <Badge
              variant="outline"
              className="text-muted-foreground bg-muted mx-1"
            >
              <Settings className="mr-1 inline-block" />
              Settings
            </Badge>
            button, then click the{" "}
            <Badge
              variant="outline"
              className="text-muted-foreground bg-muted mx-1"
            >
              <EllipsisVertical className="mx-1" />
            </Badge>{" "}
            at the top right. Select the option that says{" "}
            <b>Import options from clipboard</b>.
          </div>
          <br />
          <img
            src="/setup/settings-config.png"
            width={imageWidth}
            alt="settings config import"
            className="self-center"
            loading="eager"
          />
        </>
      ),
      title: "Configure settings",
    },
    {
      content: (
        <>
          <p>
            Go back to the home screen and tap the giant button and you should
            be all connected!{" "}
            {isMobile && (
              <>You should see a key or VPN icon in your status bar.</>
            )}
          </p>
          <br />
          <img
            src="/setup/connected.png"
            width={imageWidth}
            alt="connected"
            className="self-center"
            loading="eager"
          />
        </>
      ),
      title: (
        <div className="flex items-center">
          All done!
          <PartyPopper className="ml-2 size-4 text-orange-400" />
        </div>
      ),
    },
    {
      content: (
        <>
          <div>
            Once your trial is over, upgrade your plan to a full month, or a
            monthly subscription{" "}
            <a
              href="/dashboard/pricing"
              className="text-primary-link underline"
            >
              here
            </a>
            . I also recommend visiting{" "}
            <a href="/dashboard/tips" className="text-primary-link underline">
              Tips & Tricks
            </a>{" "}
            for increasing speeds and general troubleshooting.
          </div>
        </>
      ),
      title: "Next steps",
    },
  ];
}

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
  const [config, setConfig] = useState<string | undefined>();

  const user = data?.user;
  const profile = user?.profile;
  const setupLink = profile
    ? getHiddifyLinks(user.email, profile.hiddifyId, profile.hiddifyServerId)
    : undefined;
  const platform = getPlatform(props);

  // Poll for hiddify profile creation
  useEffect(() => {
    if (!profile?.hiddifyId) {
      setIntervalId(
        setInterval(async () => {
          const data = await mutate();
          if (data?.user?.profile?.hiddifyId) {
            clearInterval(intervalId);
          }
        }, 2000)
      );
    } else {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId);
  }, [profile?.hiddifyId]);

  useEffect(() => {
    retryOnError(
      async () =>
        await axiosFetch
          .get<object>(`${FILE_DOWNLOAD_URL}${FILE_CONFIG_JSON}`)
          .then(({ data }) => setConfig(JSON.stringify(data, null, 0)))
    );
  }, []);

  return (
    <Tabs defaultValue={platform}>
      <TabsList className="mb-8 grid h-10 w-full grid-cols-4 bg-slate-400 dark:bg-slate-800">
        <TabsTrigger value="android">
          <img
            width="20"
            height="20"
            src={FILE_TYPES.android.icon}
            alt="android"
            loading="eager"
          />
          <span className="ml-1">Android</span>
        </TabsTrigger>
        <TabsTrigger value="ios">
          <img
            width="20"
            height="20"
            src={FILE_TYPES.ios.icon}
            alt="ios"
            loading="eager"
          />
          <span className="ml-1">iOS</span>
        </TabsTrigger>
        <TabsTrigger value="pc">
          <img
            width="20"
            height="20"
            src={FILE_TYPES.pc.icon}
            alt="pc"
            loading="eager"
          />
          <span className="ml-1">PC</span>
        </TabsTrigger>
        <TabsTrigger value="mac">
          <img
            width="20"
            height="20"
            src={FILE_TYPES.mac.icon}
            alt="mac"
            loading="eager"
          />
          <span className="ml-1">Mac</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="android">
        {getSteps(
          FILE_TYPES.android.fileType,
          FILE_TYPES.android.icon,
          setupLink,
          config
        ).map((step, idx) => (
          <Step key={idx} idx={idx} {...step} />
        ))}
      </TabsContent>
      <TabsContent value="pc">
        {getSteps(
          FILE_TYPES.pc.fileType,
          FILE_TYPES.pc.icon,
          setupLink,
          config
        ).map((step, idx) => (
          <Step key={idx} idx={idx} {...step} />
        ))}
      </TabsContent>
      <TabsContent value="ios">
        {getSteps(
          FILE_TYPES.ios.fileType,
          FILE_TYPES.ios.icon,
          setupLink,
          config
        ).map((step, idx) => (
          <Step key={idx} idx={idx} {...step} />
        ))}
      </TabsContent>
      <TabsContent value="mac">
        {getSteps(
          FILE_TYPES.mac.fileType,
          FILE_TYPES.mac.icon,
          setupLink,
          config
        ).map((step, idx) => (
          <Step key={idx} idx={idx} {...step} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

export default HowToInstall;
