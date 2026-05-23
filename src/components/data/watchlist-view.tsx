"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/types";
import { readWatchlist, WatchButton } from "@/components/shared/watch-button";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { fmtMoney, fmtPct, changeColor, cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function WatchlistView({ companies }: { companies: Company[] }) {
  const [tickers, setTickers] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setTickers(readWatchlist());
    sync();
    window.addEventListener("t3-watchlist-change", sync);
    return () => window.removeEventListener("t3-watchlist-change", sync);
  }, []);

  const rows = companies.filter((c) => tickers.includes(c.ticker));

  if (rows.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2">
          <Star className="h-6 w-6 text-muted-foreground" />
        </span>
        <p className="text-sm text-muted-foreground">Your watchlist is empty.</p>
        <Button asChild size="sm"><Link href="/companies">Browse companies</Link></Button>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <THead>
          <tr>
            <th className="text-left">Company</th>
            <th className="text-right">Price</th>
            <th className="text-right">Chg %</th>
            <th className="text-right">Mkt Cap</th>
            <th className="text-right"></th>
          </tr>
        </THead>
        <TBody>
          {rows.map((c) => (
            <TR key={c.ticker}>
              <td>
                <Link href={`/companies/${c.exchange}:${c.ticker}`} className="block">
                  <span className="font-mono text-sm font-medium">{c.ticker}</span>
                  <span className="block max-w-[200px] truncate text-[11px] text-muted-foreground">{c.name}</span>
                </Link>
              </td>
              <td className="text-right tnum">${c.price.toFixed(2)}</td>
              <td className={cn("text-right tnum", changeColor(c.change))}>{fmtPct(c.change)}</td>
              <td className="text-right tnum text-muted-foreground">{fmtMoney(c.marketCap, { compact: true })}</td>
              <td className="text-right"><WatchButton ticker={c.ticker} size="icon" /></td>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}
