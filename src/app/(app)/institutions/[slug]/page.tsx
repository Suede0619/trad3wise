import { notFound } from "next/navigation";
import { getInstitution } from "@/lib/data";
import { PageHeader } from "@/components/shared/page-header";
import { Stat } from "@/components/ui/stat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoldingsTable } from "@/components/data/holdings-table";
import { fmtMoney, fmtNum, timeAgo } from "@/lib/utils";

export default async function InstitutionProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const inst = getInstitution(slug);
  if (!inst) notFound();

  const newPos = inst.topHoldings.filter((h) => h.action === "new").length;
  const added = inst.topHoldings.filter((h) => h.action === "add").length;

  return (
    <div className="space-y-5">
      <PageHeader title={inst.name} description="Institutional 13F filer" />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="13F AUM" value={fmtMoney(inst.aum, { compact: true })} />
        <Stat label="Total holdings" value={fmtNum(inst.holdingsCount)} />
        <Stat label="New positions" value={<span className="text-primary">{newPos}</span>} />
        <Stat label="Last filed" value={timeAgo(inst.lastFiled)} />
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Top holdings</CardTitle>
          <span className="text-xs text-muted-foreground">{added} added this quarter</span>
        </CardHeader>
        <CardContent className="p-0">
          <HoldingsTable holdings={inst.topHoldings} />
        </CardContent>
      </Card>
    </div>
  );
}
