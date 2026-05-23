"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fmtPct, changeColor, cn } from "@/lib/utils";

type Tick = { ticker: string; exchange: string; price: number; change: number };

export function TickerStrip({ initial }: { initial: Tick[] }) {
  const [ticks, setTicks] = useState(initial);

  // Simulate live price jitter (replace with a websocket/SSE feed in production).
  useEffect(() => {
    const id = setInterval(() => {
      setTicks((prev) =>
        prev.map((t) => {
          const delta = (Math.random() - 0.5) * 0.4;
          return {
            ...t,
            price: Number((t.price * (1 + delta / 100)).toFixed(2)),
            change: Number((t.change + delta).toFixed(2)),
          };
        }),
      );
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const row = [...ticks, ...ticks];

  return (
    <div className="relative overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex animate-[marquee_40s_linear_infinite] gap-6 whitespace-nowrap py-2 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <Link
            key={i}
            href={`/companies/${t.exchange}:${t.ticker}`}
            className="flex items-center gap-2 px-1 text-xs tnum"
          >
            <span className="font-medium">{t.ticker}</span>
            <span className="text-muted-foreground">${t.price.toFixed(2)}</span>
            <span className={cn(changeColor(t.change))}>{fmtPct(t.change)}</span>
          </Link>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
