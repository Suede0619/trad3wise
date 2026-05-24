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
 * Holdings table. Each row links to the company when a ticker is known (mock / ETF data);
 * real 13F rows only carry the issuer name + CUSIP, so they render as plain text.
 * `showChange` hides the QoQ/Action columns when no prior-period comparison is available.
 */
export function HoldingsTable({ holdings, showChange = true }: { holdings: Holding[]; showChange?: boolean }) {
  return (
    <Table>
      <THead>
        <tr>
          <th className="text-left">Holding</th>
          <th className="text-right">Shares</th>
          <th className="text-right">Value</th>
          <th className="text-right">Weight</th>
          {showChange && <th className="text-right">Δ QoQ</th>}
          {showChange && <th className="text-left">Action</th>}
        </tr>
      </THead>
      <TBody>
        {holdings.map((h, i) => (
          <TR key={h.ticker || h.company + i}>
            <td>
              {h.ticker ? (
                <Link href={`/companies/NYSE:${h.ticker}`} className="block">
                  <span className="font-mono text-sm font-medium">{h.ticker}</span>
                  <span className="block max-w-[200px] truncate text-[11px] text-muted-foreground">{h.company}</span>
                </Link>
              ) : (
                <span className="block max-w-[260px] truncate text-sm">{h.company}</span>
              )}
            </td>
            <td className="text-right tnum">{fmtNum(h.shares)}</td>
            <td className="text-right tnum">{fmtMoney(h.value, { compact: true })}</td>
            <td className="text-right tnum text-muted-foreground">{h.weight.toFixed(1)}%</td>
            {showChange && (
              <td className={cn("text-right tnum", changeColor(h.changePct))}>
                {h.action === "new" ? "new" : fmtPct(h.changePct, 0)}
              </td>
            )}
            {showChange && <td><Badge variant={actionVariant[h.action]}>{h.action}</Badge></td>}
          </TR>
        ))}
      </TBody>
    </Table>
  );
}
