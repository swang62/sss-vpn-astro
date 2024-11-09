import { type ClassValue, clsx } from "clsx";
import QRCode from "qrcode";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import type { HiddifyServerId } from "@/config/types";

import { HIDDIFY_SERVERS } from "@/config/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(msec = 1000) {
  return await new Promise(resolve => setTimeout(resolve, msec));
}

export function capitalize(str = "") {
  return str ? str[0].toUpperCase() + str.slice(1) : str;
}

export function secondsPassed(modified: string) {
  const now = new Date().getTime();
  const compare = new Date(modified || 0).getTime();

  return Math.floor((now - compare) / 1000);
}

export function dateToString(date: number) {
  if (date > 3 && date < 21) return `${date}th`;
  switch (date % 10) {
    case 1: return `${date}st`;
    case 2: return `${date}nd`;
    case 3: return `${date}rd`;
    default: return `${date}th`;
  }
}

export function getDaysLeft(packageStart?: string, mode = "no_reset", packageDays = 0) {
  const now = new Date();
  const start = new Date(packageStart ?? now);

  if (mode === "monthly") {
    // For auto-renew, use current monthly cycle
    start.setFullYear(now.getFullYear());
    start.setMonth(now.getMonth());
  }

  // Subtract 1 month if start time occurs in the future
  if (start > now) {
    start.setMonth(start.getMonth() - 1);
  }

  const end = new Date(start);
  if (mode === "no_reset") {
    // If no auto-renew, add fixed days
    end.setDate(end.getDate() + packageDays);
  } else if (mode === "monthly") {
    end.setMonth(end.getMonth() + 1);
  }

  const DAY_LENGTH = 24 * 60 * 60 * 1000;
  const days = Math.ceil((end.valueOf() - now.valueOf()) / DAY_LENGTH);
  const daysLeft = days > 0 ? days : 0;
  const endDate = end.toLocaleDateString("us", { dateStyle: "medium" });

  return { daysLeft, endDate }; ;
}

export function getHiddifyLinks(email: string, id: string, serverId: HiddifyServerId) {
  const ip = HIDDIFY_SERVERS[serverId].ip;
  const setupLink = HIDDIFY_SERVERS[serverId].setupLink;

  const url = `${setupLink}/${id}/#${email}`;

  return { ip, url };
}

export async function getHiddifyQR(url: string) {
  try {
    return await QRCode.toDataURL(url);
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "absolute";
    textarea.style.left = "-99999999px";
    document.body.prepend(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success("Copied to clipboard!");
    } catch (err) {
      console.error(err);
    } finally {
      textarea.remove();
    }
  }
}
