import { notFound } from "next/navigation";
import { getCompany } from "@/lib/data";
import { EntityTabs } from "@/components/shared/entity-tabs";
import { WatchButton } from "@/components/shared/watch-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fmtPct, fmtMoney, changeColor, cn } from "@/lib/utils";
import Link from "next/link";
import { Bell } from "lucide-react";

function parse(param: string) {
  const decoded = decodeURIComponent(param);
  const [exchange, ticker] = decoded.includes(":") ? decoded.split(":") : ["NYSE", decoded];
  return { exchange, ticker };
}

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: raw } = await params;
  const { exchange, ticker } = parse(raw);
  const company = getCompany(exchange, ticker) ?? getCompany("NASDAQ", ticker) ?? getCompany("NYSE", ticker);
  if (!company) notFound();

  const base = `/companies/${company.exchange}:${company.ticker}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-2xl font-semibold">{company.ticker}</h1>
            <Badge variant="outline">{company.exchange}</Badge>
            <Badge variant="default">{company.sector}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{company.name}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tnum">${company.price.toFixed(2)}</span>
            <span className={cn("text-sm font-medium tnum", changeColor(company.change))}>
              {fmtPct(company.change)} today
            </span>
            <span className="text-xs text-muted-foreground">· {fmtMoney(company.marketCap, { compact: true })} mkt cap</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <WatchButton ticker={company.ticker} />
          <Button variant="outline" size="sm" asChild>
            <Link href="/alerts"><Bell className="h-4 w-4" /> Alert</Link>
          </Button>
        </div>
      </div>

      <EntityTabs
        base={base}
        tabs={[
          { label: "Overview", href: "" },
          { label: "Financials", href: "/financials" },
          { label: "Filings", href: "/filings" },
          { label: "News", href: "/news" },
        ]}
      />

      {children}
    </div>
  );
}
