import { notFound } from "next/navigation";
import { getInstitution, getInstitutionHoldings } from "@/lib/data";
import { PageHeader } from "@/components/shared/page-header";
import { Stat } from "@/components/ui/stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoldingsTable } from "@/components/data/holdings-table";
import { fmtMoney, fmtNum, timeAgo } from "@/lib/utils";

export const revalidate = 3600;

export default async function InstitutionProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inst = getInstitution(slug);
  if (!inst) notFound();

  const live = await getInstitutionHoldings(inst.name);
  const isLive = live.source === "edgar";

  const holdings = isLive ? live.holdings : inst.topHoldings;
  const aum = isLive ? (live.totalValue ?? inst.aum) : inst.aum;
  const count = isLive ? (live.count ?? inst.holdingsCount) : inst.holdingsCount;
  const newPos = inst.topHoldings.filter((h) => h.action === "new").length;

  return (
    <div className="space-y-5">
      <PageHeader title={inst.name} description="Institutional 13F filer">
        {isLive ? (
          <Badge variant="up"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-up" /> Live 13F from SEC EDGAR</Badge>
        ) : (
          <Badge variant="warn">Sample data</Badge>
        )}
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={isLive ? "13F portfolio value" : "13F AUM"} value={fmtMoney(aum, { compact: true })} />
        <Stat label="Total holdings" value={fmtNum(count)} />
        {isLive ? (
          <Stat label="Period" value={live.asOf ?? "—"} />
        ) : (
          <Stat label="New positions" value={<span className="text-primary">{newPos}</span>} />
        )}
        <Stat label="Last filed" value={isLive && live.asOf ? live.asOf : timeAgo(inst.lastFiled)} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Top holdings</CardTitle>
          <span className="text-xs text-muted-foreground">
            {isLive ? `Top ${holdings.length} of ${fmtNum(count)} positions` : "by reported value"}
          </span>
        </CardHeader>
        <CardContent className="p-0">
          <HoldingsTable holdings={holdings} live={isLive} />
        </CardContent>
      </Card>
    </div>
  );
}
