import { notFound } from "next/navigation";
import Link from "next/link";
import { getCompany, getPriceSeries, getCompanyFilings, listInsiderTransactions } from "@/lib/data";
import { parseTicker, fmtMoney, fmtCompact, fmtNum, timeAgo, fmtPct, changeColor, cn } from "@/lib/utils";
import { PriceChart } from "@/components/charts/price-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Badge } from "@/components/ui/badge";
import { SignalBadge } from "@/components/shared/signal-badge";

export default async function CompanyOverview({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { exchange, ticker } = parseTicker(raw);
  const company = getCompany(exchange, ticker) ?? getCompany("NASDAQ", ticker) ?? getCompany("NYSE", ticker);
  if (!company) notFound();

  const series = getPriceSeries(company.ticker);
  const { filings: allFilings } = await getCompanyFilings(company.ticker, 5);
  const filings = allFilings.slice(0, 5);
  const insider = listInsiderTransactions().filter((t) => t.ticker === company.ticker).slice(0, 5);

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <Card>
          <CardHeader><CardTitle>Price · 90 days</CardTitle></CardHeader>
          <CardContent><PriceChart data={series} /></CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Market cap" value={fmtMoney(company.marketCap, { compact: true })} />
          <Stat label="Volume" value={fmtCompact(company.volume)} />
          <Stat label="Employees" value={fmtNum(company.employees)} />
          <Stat label="Day change" value={<span className={changeColor(company.change)}>{fmtPct(company.change)}</span>} />
        </div>

        <Card>
          <CardHeader><CardTitle>About</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>{company.description}</p>
            <div className="grid grid-cols-2 gap-2 pt-2 text-foreground sm:grid-cols-3">
              <div><span className="text-muted-foreground">CEO:</span> {company.ceo}</div>
              <div><span className="text-muted-foreground">HQ:</span> {company.hq}</div>
              <div><span className="text-muted-foreground">Industry:</span> {company.industry}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        {company.signals.length > 0 && (
          <Card>
            <CardHeader><CardTitle>Active signals</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-1">
              {company.signals.map((s, i) => <SignalBadge key={i} kind={s} />)}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent filings</CardTitle>
            <Link href={`/companies/${company.exchange}:${company.ticker}/filings`} className="text-xs text-primary hover:underline">All</Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {filings.length ? filings.map((f) => {
              const cls = "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-surface-2";
              const inner = (
                <>
                  <Badge variant="outline" className="font-mono">{f.type}</Badge>
                  <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(f.filedAt)}</span>
                </>
              );
              return f.live ? (
                <a key={f.id} href={f.url} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
              ) : (
                <Link key={f.id} href={`/sec-filings/${f.id}`} className={cls}>{inner}</Link>
              );
            }) : <p className="px-2 text-xs text-muted-foreground">No filings indexed.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Insider activity</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {insider.length ? insider.map((t) => (
              <Link key={t.id} href={`/insiders/${t.insiderSlug}`} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-surface-2">
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium">{t.insider}</div>
                  <div className="text-[11px] text-muted-foreground">{t.role}</div>
                </div>
                <Badge variant={t.type === "buy" ? "up" : "down"}>{t.type}</Badge>
              </Link>
            )) : <p className="px-2 text-xs text-muted-foreground">No insider activity.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
