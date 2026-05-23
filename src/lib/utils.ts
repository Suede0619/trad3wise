import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 2,
});

export function fmtCompact(n: number): string {
  return compact.format(n);
}

export function fmtMoney(n: number, opts: { compact?: boolean } = {}): string {
  if (opts.compact) return "$" + compact.format(n);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

export function fmtNum(n: number, digits = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(n);
}

export function fmtPct(n: number, digits = 2): string {
  const s = n.toFixed(digits);
  return `${n > 0 ? "+" : ""}${s}%`;
}

export function changeColor(n: number): string {
  if (n > 0) return "text-up";
  if (n < 0) return "text-down";
  return "text-muted-foreground";
}

export function timeAgo(date: Date | string | number): string {
  const d = typeof date === "object" ? date : new Date(date);
  const secs = Math.round((Date.now() - d.getTime()) / 1000);
  const table: [number, string][] = [
    [60, "s"],
    [3600, "m"],
    [86400, "h"],
    [2592000, "d"],
    [31536000, "mo"],
    [Infinity, "y"],
  ];
  let unit = "s";
  let value = secs;
  let prev = 1;
  for (const [limit, label] of table) {
    if (secs < limit) {
      unit = label;
      value = Math.max(1, Math.floor(secs / prev));
      break;
    }
    prev = limit;
  }
  return `${value}${unit} ago`;
}

export function parseTicker(param: string): { exchange: string; ticker: string } {
  const decoded = decodeURIComponent(param);
  const [exchange, ticker] = decoded.includes(":")
    ? decoded.split(":")
    : ["NYSE", decoded];
  return { exchange, ticker };
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
