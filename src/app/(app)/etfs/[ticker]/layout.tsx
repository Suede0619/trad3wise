import { notFound } from "next/navigation";
import { getETF } from "@/lib/data";
import { parseTicker, fmtMoney, fmtPct, changeColor, cn } from "@/lib/utils";
import { EntityTabs } from "@/components/shared/entity-tabs";
import { WatchButton } from "@/components/shared/watch-button";
import { Badge } from "@/components/ui/badge";

export default async function ETFLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ ticker: string }>;
}) {
  const { ticker: raw } = await params;
  const { ticker } = parseTicker(raw);
  const etf = getETF(ticker);
  if (!etf) notFound();

  const base = `/etfs/${etf.exchange}:${etf.ticker}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-2xl font-semibold">{etf.ticker}</h1>
            <Badge variant="outline">{etf.exchange}</Badge>
            <Badge variant="default">{etf.category}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{etf.name} · {etf.issuer}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tnum">${etf.price.toFixed(2)}</span>
            <span className={cn("text-sm font-medium tnum", changeColor(etf.change))}>{fmtPct(etf.change)}</span>
            <span className="text-xs text-muted-foreground">· {fmtMoney(etf.aum, { compact: true })} AUM · {etf.expenseRatio.toFixed(2)}% ER</span>
          </div>
        </div>
        <WatchButton ticker={etf.ticker} />
      </div>

      <EntityTabs
        base={base}
        tabs={[
          { label: "Overview", href: "" },
          { label: "Holdings", href: "/holdings" },
          { label: "News", href: "/news" },
        ]}
      />

      {children}
    </div>
  );
}
