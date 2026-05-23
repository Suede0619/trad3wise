import type { Metadata } from "next";
import Link from "next/link";
import { listETFs } from "@/lib/data";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { fmtMoney, fmtPct, changeColor, cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ETFs",
  description: "ETF screener — issuers, AUM, expense ratios, categories, and net flows.",
};

export default function ETFsPage() {
  const etfs = listETFs();
  return (
    <div>
      <PageHeader title="ETF screener" description="Exchange-traded funds by issuer, AUM, expense ratio, category, and net flows." />
      <Card>
        <Table>
          <THead>
            <tr>
              <th className="text-left">ETF</th>
              <th className="text-left">Issuer</th>
              <th className="text-left">Category</th>
              <th className="text-right">AUM</th>
              <th className="text-right">Expense</th>
              <th className="text-right">Price</th>
              <th className="text-right">Chg</th>
              <th className="text-right">1M flow</th>
            </tr>
          </THead>
          <TBody>
            {etfs.map((e) => (
              <TR key={e.ticker}>
                <td>
                  <Link href={`/etfs/${e.exchange}:${e.ticker}`} className="block">
                    <span className="font-mono text-sm font-medium">{e.ticker}</span>
                    <span className="block max-w-[220px] truncate text-[11px] text-muted-foreground">{e.name}</span>
                  </Link>
                </td>
                <td className="text-muted-foreground">{e.issuer}</td>
                <td className="text-muted-foreground">{e.category}</td>
                <td className="text-right tnum">{fmtMoney(e.aum, { compact: true })}</td>
                <td className="text-right tnum text-muted-foreground">{e.expenseRatio.toFixed(2)}%</td>
                <td className="text-right tnum">${e.price.toFixed(2)}</td>
                <td className={cn("text-right tnum", changeColor(e.change))}>{fmtPct(e.change)}</td>
                <td className={cn("text-right tnum", changeColor(e.flow1m))}>{fmtMoney(e.flow1m, { compact: true })}</td>
              </TR>
            ))}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
