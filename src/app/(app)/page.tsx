import Link from "next/link";
import { getMovers, listSignals, getLatestFilings, listFilings, listNews, listCompanies } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/charts/sparkline";
import { SignalBadge } from "@/components/shared/signal-badge";
import { TickerStrip } from "@/components/shared/ticker-strip";
import { getSpark } from "@/lib/data";
import { fmtMoney, fmtPct, changeColor, cn, timeAgo, fmtCompact } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Activity, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  const { gainers, losers, active } = getMovers();
  const signals = listSignals().slice(0, 12);
  const { filings } = await getLatestFilings(6);
  const news = listNews().slice(0, 5);
  const companies = listCompanies();

  const ticks = companies.slice(0, 14).map((c) => ({
    ticker: c.ticker,
    exchange: c.exchange,
    price: c.price,
    change: c.change,
  }));

  const totalMktCap = companies.reduce((s, c) => s + c.marketCap, 0);
  const advancers = companies.filter((c) => c.change > 0).length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-grid p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="primary" className="mb-3">
            <Activity className="h-3 w-3" /> Filings in. Signals out.
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            The financial screener built on SEC filings.
          </h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Track insider trades, institutional flow, congressional trades, dilution risk, and market
            movers in real time — with AI that reads every filing for you.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/ai"><Sparkles className="h-4 w-4" /> Ask the AI agent</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/companies">Open screener</Link>
            </Button>
          </div>
        </div>
      </div>

      <TickerStrip initial={ticks} />

      {/* Market stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Tracked market cap" value={fmtMoney(totalMktCap, { compact: true })} sub={<span className="text-muted-foreground">{companies.length} companies</span>} />
        <Stat label="Advancers" value={advancers} sub={<span className="text-up">{fmtPct((advancers / companies.length) * 100)} of universe</span>} />
        <Stat label="Live signals" value={listSignals().length} sub={<span className="text-muted-foreground">last 30 days</span>} />
        <Stat label="New filings" value={listFilings().length} sub={<span className="text-muted-foreground">indexed</span>} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Signals feed */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Latest signals</CardTitle>
            <Link href="/sec-filings" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {signals.map((s) => (
              <Link
                key={s.id}
                href={`/companies/${companies.find((c) => c.ticker === s.ticker)?.exchange ?? "NYSE"}:${s.ticker}`}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-surface-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <SignalBadge kind={s.kind} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{s.headline}</div>
                    <div className="truncate text-xs text-muted-foreground">{s.detail}</div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-xs font-medium">{s.ticker}</div>
                  <div className="text-[11px] text-muted-foreground">{timeAgo(s.at)}</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Movers */}
        <div className="space-y-6">
          <MoversCard title="Top gainers" rows={gainers} dir="up" />
          <MoversCard title="Top losers" rows={losers} dir="down" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <MoversCard title="Most active" rows={active} dir="vol" className="lg:col-span-1" />

        {/* Latest filings */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent SEC filings</CardTitle>
            <Link href="/sec-filings" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {filings.map((f) => {
              const inner = (
                <>
                  <div className="flex min-w-0 items-center gap-3">
                    <Badge variant="outline" className="font-mono">{f.type}</Badge>
                    <span className="truncate text-sm">{f.company}</span>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{timeAgo(f.filedAt)}</span>
                </>
              );
              const cls = "flex items-center justify-between gap-3 rounded-md px-2 py-2 hover:bg-surface-2";
              return f.live ? (
                <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : (
                <Link key={f.id} href={`/sec-filings/${f.id}`} className={cls}>{inner}</Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* News */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Market news</CardTitle>
          <Link href="/news" className="text-xs text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {news.map((n) => (
            <div key={n.id} className="rounded-md border border-border/60 p-3">
              <div className="mb-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                <span>{n.source}</span>·<span>{timeAgo(n.publishedAt)}</span>
                <Badge variant={n.sentiment === "positive" ? "up" : n.sentiment === "negative" ? "down" : "outline"} className="ml-auto">
                  {n.sentiment}
                </Badge>
              </div>
              <p className="text-sm leading-snug">{n.headline}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function MoversCard({
  title,
  rows,
  dir,
  className,
}: {
  title: string;
  rows: { ticker: string; exchange: string; name: string; price: number; change: number; volume: number }[];
  dir: "up" | "down" | "vol";
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {dir === "up" && <ArrowUpRight className="h-4 w-4 text-up" />}
          {dir === "down" && <ArrowDownRight className="h-4 w-4 text-down" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {rows.map((c) => (
          <Link key={c.ticker} href={`/companies/${c.exchange}:${c.ticker}`} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-surface-2">
            <div className="min-w-0">
              <div className="font-mono text-sm font-medium">{c.ticker}</div>
              <div className="truncate text-[11px] text-muted-foreground">{c.name}</div>
            </div>
            <Sparkline data={getSpark(c.ticker)} className="hidden sm:block" />
            <div className="shrink-0 text-right tnum">
              {dir === "vol" ? (
                <div className="text-xs text-muted-foreground">{fmtCompact(c.volume)}</div>
              ) : (
                <div className={cn("text-xs font-medium", changeColor(c.change))}>{fmtPct(c.change)}</div>
              )}
              <div className="text-[11px] text-muted-foreground">${c.price.toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
