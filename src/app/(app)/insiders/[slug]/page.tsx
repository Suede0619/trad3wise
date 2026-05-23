import { notFound } from "next/navigation";
import Link from "next/link";
import { getInsider } from "@/lib/data";
import { PageHeader } from "@/components/shared/page-header";
import { Stat } from "@/components/ui/stat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { fmtMoney, fmtNum, timeAgo } from "@/lib/utils";

export default async function InsiderProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insider = getInsider(slug);
  if (!insider) notFound();

  return (
    <div className="space-y-5">
      <PageHeader title={insider.name} description={insider.roles.join(" · ")} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total bought" value={<span className="text-up">{fmtMoney(insider.totalBought, { compact: true })}</span>} />
        <Stat label="Total sold" value={<span className="text-down">{fmtMoney(insider.totalSold, { compact: true })}</span>} />
        <Stat label="Transactions" value={insider.txns.length} />
        <Stat label="Companies" value={insider.companies.length} />
      </div>

      <div className="flex flex-wrap gap-1">
        {insider.companies.map((t) => (
          <Link key={t} href={`/companies/NYSE:${t}`}><Badge variant="outline" className="font-mono">{t}</Badge></Link>
        ))}
      </div>

      <Card>
        <Table>
          <THead>
            <tr>
              <th className="text-left">Ticker</th>
              <th className="text-left">Role</th>
              <th className="text-left">Side</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Value</th>
              <th className="text-right">Filed</th>
            </tr>
          </THead>
          <TBody>
            {insider.txns.map((t) => (
              <TR key={t.id}>
                <td><Link href={`/companies/NYSE:${t.ticker}`} className="font-mono hover:text-primary">{t.ticker}</Link></td>
                <td className="text-muted-foreground">{t.role}</td>
                <td><Badge variant={t.type === "buy" ? "up" : "down"}>{t.type}</Badge></td>
                <td className="text-right tnum">{fmtNum(t.shares)}</td>
                <td className="text-right tnum">{fmtMoney(t.value, { compact: true })}</td>
                <td className="text-right text-[11px] text-muted-foreground">{timeAgo(t.filedAt)}</td>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
