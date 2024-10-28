import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
