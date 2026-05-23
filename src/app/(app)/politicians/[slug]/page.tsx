import { notFound } from "next/navigation";
import Link from "next/link";
import { getPolitician } from "@/lib/data";
import { PageHeader } from "@/components/shared/page-header";
import { Stat } from "@/components/ui/stat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { timeAgo } from "@/lib/utils";

export default async function PoliticianProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pol = getPolitician(slug);
  if (!pol) notFound();

  const buys = pol.trades.filter((t) => t.type === "buy").length;
  const sells = pol.trades.length - buys;

  return (
    <div className="space-y-5">
      <PageHeader title={pol.politician} description={`${pol.chamber} · ${pol.party}-${pol.state}`} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Disclosures" value={pol.trades.length} />
        <Stat label="Buys" value={<span className="text-up">{buys}</span>} />
        <Stat label="Sells" value={<span className="text-down">{sells}</span>} />
        <Stat label="Chamber" value={pol.chamber} />
      </div>

      <Card>
        <Table>
          <THead>
            <tr>
              <th className="text-left">Ticker</th>
              <th className="text-left">Side</th>
              <th className="text-left">Amount</th>
              <th className="text-right">Traded</th>
              <th className="text-right">Disclosed</th>
            </tr>
          </THead>
          <TBody>
            {pol.trades.map((t) => (
              <TR key={t.id}>
                <td><Link href={`/companies/NYSE:${t.ticker}`} className="font-mono hover:text-primary">{t.ticker}</Link></td>
                <td><Badge variant={t.type === "buy" ? "up" : "down"}>{t.type}</Badge></td>
                <td className="tnum text-muted-foreground">{t.amountRange}</td>
                <td className="text-right text-[11px] text-muted-foreground">{timeAgo(t.tradedAt)}</td>
                <td className="text-right text-[11px] text-muted-foreground">{timeAgo(t.disclosedAt)}</td>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
