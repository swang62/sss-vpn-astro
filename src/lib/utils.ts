import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import type UAParser from "ua-parser-js";
import { HIDDIFY_SERVERS } from "@/config/constants";
import type { Platform } from "@/config/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(msec = 1000) {
  return await new Promise((resolve) => setTimeout(resolve, msec));
}

export async function retryOnError<T>(
  func: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> {
  try {
    const response = await func();
    return response;
  } catch (error) {
    if (retries === 0) throw error;

    // Wait and then try again.
    await sleep(delay);
    return retryOnError(func, retries - 1, delay * 2);
  }
}

export function capitalize(str = "") {
  return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
}

export function minutesPassedSince(lastModified: string) {
  const now = Date.now();
  const compare = new Date(lastModified || 0).getTime();

  return Math.floor((now - compare) / (60 * 1000));
}

export function dateToString(date: number) {
  if (date > 3 && date < 21) return `${date}th`;
  switch (date % 10) {
    case 1:
      return `${date}st`;
    case 2:
      return `${date}nd`;
    case 3:
      return `${date}rd`;
    default:
      return `${date}th`;
  }
}

export function getDaysLeft(
  packageStart?: string,
  mode = "no_reset",
  packageDays = 0
) {
  if (!packageStart) {
    return { daysLeft: 0 };
  }

  const now = new Date();
  const start = new Date(packageStart);

  // Account for max timezone difference (hiddify start_date is imprecise)
  // start.setDate(start.getDate() - 1);

  if (mode === "monthly") {
    // For auto-renew, use current monthly cycle
    start.setFullYear(now.getFullYear());

    // If the start time is way in the past, reset to the current month
    if (now.getMonth() !== start.getMonth()) {
      start.setMonth(now.getMonth());

      // Reset 1 month if days overshoot
      if (start.getDate() > now.getDate()) {
        start.setMonth(start.getMonth() - 1);
      }
    }
  }

  const end = new Date(start);
  if (mode === "no_reset") {
    // If no auto-renew, add fixed days
    end.setDate(end.getDate() + packageDays);
  } else if (mode === "monthly") {
    end.setMonth(end.getMonth() + 1);
  }

  const dayTotalMs = 24 * 60 * 60 * 1000;
  const days = Math.ceil((end.valueOf() - now.valueOf()) / dayTotalMs);
  const daysLeft = days > 0 ? days : 0;
  const endDate = end.toLocaleDateString("us", { dateStyle: "medium" });

  return { daysLeft, endDate };
}

export function getHiddifyLinks(email: string, id: string) {
  return `${HIDDIFY_SERVERS.setupLink}/${id}/#${email}`;
}

export async function copyToClipboard(text: string) {
  await navigator?.clipboard.writeText(text);
  toast.success("Copied to clipboard!");
}

export function getPlatform(
  device: UAParser.IDevice,
  os: UAParser.IOS
): Platform {
  if (!device.type) {
    // Is desktop
    if (os.name === "macOS") {
      return "mac";
    } else {
      return "pc";
    }
  } else {
    // Is mobile
    if (os.name === "iOS") {
      return "ios";
    } else {
      return "android";
    }
  }
}
