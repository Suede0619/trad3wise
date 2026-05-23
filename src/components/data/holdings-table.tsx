import Link from "next/link";
import type { Holding } from "@/lib/types";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fmtMoney, fmtNum, fmtPct, changeColor, cn } from "@/lib/utils";

const actionVariant = {
  new: "primary",
  add: "up",
  trim: "down",
  sold: "down",
  hold: "outline",
} as const;

export function HoldingsTable({ holdings }: { holdings: Holding[] }) {
  return (
    <Table>
      <THead>
        <tr>
          <th className="text-left">Holding</th>
          <th className="text-right">Shares</th>
          <th className="text-right">Value</th>
          <th className="text-right">Weight</th>
          <th className="text-right">Δ QoQ</th>
          <th className="text-left">Action</th>
        </tr>
      </THead>
      <TBody>
        {holdings.map((h) => (
          <TR key={h.ticker}>
            <td>
              <Link href={`/companies/NYSE:${h.ticker}`} className="block">
                <span className="font-mono text-sm font-medium">{h.ticker}</span>
                <span className="block max-w-[200px] truncate text-[11px] text-muted-foreground">{h.company}</span>
              </Link>
            </td>
            <td className="text-right tnum">{fmtNum(h.shares)}</td>
            <td className="text-right tnum">{fmtMoney(h.value, { compact: true })}</td>
            <td className="text-right tnum text-muted-foreground">{h.weight.toFixed(1)}%</td>
            <td className={cn("text-right tnum", changeColor(h.changePct))}>{fmtPct(h.changePct, 0)}</td>
            <td><Badge variant={actionVariant[h.action]}>{h.action}</Badge></td>
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
