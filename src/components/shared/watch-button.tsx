"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KEY = "t3-watchlist";

export function readWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function writeWatchlist(items: string[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("t3-watchlist-change"));
}

export function WatchButton({
  ticker,
  size = "sm",
}: {
  ticker: string;
  size?: "sm" | "default" | "icon";
}) {
  const [watched, setWatched] = useState(false);

  useEffect(() => {
    setWatched(readWatchlist().includes(ticker));
    const onChange = () => setWatched(readWatchlist().includes(ticker));
    window.addEventListener("t3-watchlist-change", onChange);
    return () => window.removeEventListener("t3-watchlist-change", onChange);
  }, [ticker]);

  const toggle = () => {
    const cur = readWatchlist();
    const next = cur.includes(ticker)
      ? cur.filter((t) => t !== ticker)
      : [...cur, ticker];
    writeWatchlist(next);
    setWatched(next.includes(ticker));
  };

  return (
    <Button
      variant={watched ? "secondary" : "outline"}
      size={size}
      onClick={toggle}
      aria-label={watched ? "Remove from watchlist" : "Add to watchlist"}
    >
      <Star className={cn("h-4 w-4", watched && "fill-primary text-primary")} />
      {size !== "icon" && (watched ? "Watching" : "Watch")}
    </Button>
  );
}
