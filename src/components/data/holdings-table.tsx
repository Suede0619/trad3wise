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

/**
 * Holdings table. In `live` mode (real 13F data) there is no per-issuer ticker/CUSIP→ticker
 * link and no quarter-over-quarter delta, so those columns are hidden.
 */
export function HoldingsTable({ holdings, live = false }: { holdings: Holding[]; live?: boolean }) {
  return (
    <Table>
      <THead>
        <tr>
          <th className="text-left">Holding</th>
          <th className="text-right">Shares</th>
          <th className="text-right">Value</th>
          <th className="text-right">Weight</th>
          {!live && <th className="text-right">Δ QoQ</th>}
          {!live && <th className="text-left">Action</th>}
        </tr>
      </THead>
      <TBody>
        {holdings.map((h, i) => (
          <TR key={h.ticker || h.company + i}>
            <td>
              {live || !h.ticker ? (
                <span className="block max-w-[260px] truncate text-sm">{h.company}</span>
              ) : (
                <Link href={`/companies/NYSE:${h.ticker}`} className="block">
                  <span className="font-mono text-sm font-medium">{h.ticker}</span>
                  <span className="block max-w-[200px] truncate text-[11px] text-muted-foreground">{h.company}</span>
                </Link>
              )}
            </td>
            <td className="text-right tnum">{fmtNum(h.shares)}</td>
            <td className="text-right tnum">{fmtMoney(h.value, { compact: true })}</td>
            <td className="text-right tnum text-muted-foreground">{h.weight.toFixed(1)}%</td>
            {!live && <td className={cn("text-right tnum", changeColor(h.changePct))}>{fmtPct(h.changePct, 0)}</td>}
            {!live && <td><Badge variant={actionVariant[h.action]}>{h.action}</Badge></td>}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
