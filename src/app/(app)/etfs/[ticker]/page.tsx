import { notFound } from "next/navigation";
import { getETF } from "@/lib/data";
import { parseTicker, fmtMoney, changeColor, fmtPct } from "@/lib/utils";
import { Stat } from "@/components/ui/stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoldingsTable } from "@/components/data/holdings-table";

export default async function ETFOverview({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { ticker } = parseTicker(raw);
  const etf = getETF(ticker);
  if (!etf) notFound();

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="AUM" value={fmtMoney(etf.aum, { compact: true })} />
        <Stat label="Expense ratio" value={`${etf.expenseRatio.toFixed(2)}%`} />
        <Stat label="1M net flow" value={<span className={changeColor(etf.flow1m)}>{fmtMoney(etf.flow1m, { compact: true })}</span>} />
        <Stat label="Day change" value={<span className={changeColor(etf.change)}>{fmtPct(etf.change)}</span>} />
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Top holdings</CardTitle>
          <span className="text-xs text-muted-foreground">{etf.holdings.length} constituents shown</span>
        </CardHeader>
        <CardContent className="p-0">
          <HoldingsTable holdings={etf.holdings.slice(0, 8)} />
        </CardContent>
      </Card>
    </div>
  );
}
