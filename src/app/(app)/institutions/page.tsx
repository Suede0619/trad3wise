import type { Metadata } from "next";
import Link from "next/link";
import { listInstitutions } from "@/lib/data";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { fmtMoney, fmtNum, timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Institutions",
  description: "13F institutional investor directory — AUM, holdings count, and quarterly positions.",
};

export default function InstitutionsPage() {
  const institutions = listInstitutions();
  return (
    <div>
      <PageHeader
        title="Institutional investors"
        description="13F filers ranked by assets under management. Drill into any firm for top holdings and quarter-over-quarter changes."
      />
      <Card>
        <Table>
          <THead>
            <tr>
              <th className="text-left">Firm</th>
              <th className="text-right">AUM (13F)</th>
              <th className="text-right">Holdings</th>
              <th className="text-right">Last filed</th>
            </tr>
          </THead>
          <TBody>
            {institutions.map((i) => (
              <TR key={i.slug}>
                <td><Link href={`/institutions/${i.slug}`} className="text-sm font-medium hover:text-primary">{i.name}</Link></td>
                <td className="text-right tnum">{fmtMoney(i.aum, { compact: true })}</td>
                <td className="text-right tnum text-muted-foreground">{fmtNum(i.holdingsCount)}</td>
                <td className="text-right text-[11px] text-muted-foreground">{timeAgo(i.lastFiled)}</td>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
