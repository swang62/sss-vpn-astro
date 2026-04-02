import { Copy, EllipsisVertical, PartyPopper, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";

import type { Platform } from "@/config/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FILE_DOWNLOAD_URL,
  FILE_START_COMMAND,
  FILE_TYPES,
} from "@/config/constants";
import { fetchUser } from "@/lib/api-clients";
import { copyToClipboard, getHiddifyLinks } from "@/lib/utils";

import type { StepProps } from "./Step";

import Step from "./Step";

function getSteps(
  downloadFile: string,
  downloadIcon: string,
  config: string,
  setupLink?: string
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
            {!isIOS && "Click the button below to download the app manually"}
            {isIOS && (
              <>
                Click this
                <a
                  href="https://apps.apple.com/us/app/hiddify-proxy-vpn/id6596777532"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-link px-1 underline"
                >
                  link
                </a>
                to directly install from the US App store. If you have a Chinese
                Apple account, you will need to first change your country/region
                to the United States, see the instructions{" "}
                <a
                  href="https://support.apple.com/zh-cn/118283"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-link underline"
                >
                  here
                </a>
                . For the address, you can use any US address.
                <br />
                <br />
                <p>
                  If you are unable to install it through the App Store, then
                  re-open up this site on your Macbook or PC and proceed to this{" "}
                  <a
                    href="/dashboard/ios"
                    className="text-primary-link underline"
                  >
                    installation guide
                  </a>
                  .
                </p>
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
          {!isIOS && (
            <a
              href={`${FILE_DOWNLOAD_URL}${downloadFile}`}
              className="self-center pr-8"
            >
              <Button data-umami-event="download-app">
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
          )}
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
      skip: isIOS,
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
              defaultValue={config}
              readOnly
              className="bg-muted text-muted-foreground"
            />
            <Button onClick={() => copyToClipboard(config)}>
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
            Once your trial is over, you can upgrade your plan to a single
            month, or a monthly subscription{" "}
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
  platform: Platform;
  config: string;
}

function HowToInstall({ config, platform }: Props) {
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>();
  const { data, mutate } = useSWR("fetchUser", fetchUser);

  const user = data?.user;
  const profile = user?.profile;
  const setupLink = profile
    ? getHiddifyLinks(user.email, profile.hiddifyId, profile.hiddifyServerId)
    : undefined;

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
          config,
          setupLink
        ).map((step, idx) => (
          <Step key={idx} idx={idx} {...step} />
        ))}
      </TabsContent>
      <TabsContent value="pc">
        {getSteps(
          FILE_TYPES.pc.fileType,
          FILE_TYPES.pc.icon,
          config,
          setupLink
        ).map((step, idx) => (
          <Step key={idx} idx={idx} {...step} />
        ))}
      </TabsContent>
      <TabsContent value="ios">
        {getSteps(
          FILE_TYPES.ios.fileType,
          FILE_TYPES.ios.icon,
          config,
          setupLink
        )
          .filter((step) => !step.skip)
          .map((step, idx) => (
            <Step key={idx} idx={idx} {...step} />
          ))}
      </TabsContent>
      <TabsContent value="mac">
        {getSteps(
          FILE_TYPES.mac.fileType,
          FILE_TYPES.mac.icon,
          config,
          setupLink
        ).map((step, idx) => (
          <Step key={idx} idx={idx} {...step} />
        ))}
      </TabsContent>
    </Tabs>
  );
}

export default HowToInstall;
