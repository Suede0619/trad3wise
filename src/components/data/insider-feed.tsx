"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { InsiderTransaction } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fmtMoney, fmtNum, timeAgo } from "@/lib/utils";

export function InsiderFeed({ txns }: { txns: InsiderTransaction[] }) {
  const [q, setQ] = useState("");
  const [side, setSide] = useState("all");
  const [min, setMin] = useState("0");

  const rows = useMemo(
    () =>
      txns.filter((t) => {
        if (q && !`${t.ticker} ${t.insider} ${t.company}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (side !== "all" && t.type !== side) return false;
        if (t.value < Number(min)) return false;
        return true;
      }),
    [txns, q, side, min],
  );

  return (
    <Card>
      <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row">
        <Input placeholder="Search insider, ticker, company…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <Select value={side} onChange={(e) => setSide(e.target.value)}>
          <option value="all">Buys & sells</option>
          <option value="buy">Buys only</option>
          <option value="sell">Sells only</option>
        </Select>
        <Select value={min} onChange={(e) => setMin(e.target.value)}>
          <option value="0">Any value</option>
          <option value="100000">&gt; $100K</option>
          <option value="1000000">&gt; $1M</option>
          <option value="5000000">&gt; $5M</option>
        </Select>
        <span className="flex items-center text-xs text-muted-foreground sm:ml-auto">{rows.length} transactions</span>
      </div>
      <Table>
        <THead>
          <tr>
            <th className="text-left">Insider</th>
            <th className="text-left">Ticker</th>
            <th className="text-left">Side</th>
            <th className="text-right">Shares</th>
            <th className="text-right">Price</th>
            <th className="text-right">Value</th>
            <th className="text-right">Filed</th>
          </tr>
        </THead>
        <TBody>
          {rows.slice(0, 60).map((t) => (
            <TR key={t.id}>
              <td>
                <Link href={`/insiders/${t.insiderSlug}`} className="block">
                  <span className="text-sm font-medium">{t.insider}</span>
                  <span className="block text-[11px] text-muted-foreground">{t.role}</span>
                </Link>
              </td>
              <td><Link href={`/companies/NYSE:${t.ticker}`} className="font-mono text-sm hover:text-primary">{t.ticker}</Link></td>
              <td><Badge variant={t.type === "buy" ? "up" : "down"}>{t.type} ({t.code})</Badge></td>
              <td className="text-right tnum">{fmtNum(t.shares)}</td>
              <td className="text-right tnum text-muted-foreground">${t.price.toFixed(2)}</td>
              <td className="text-right tnum font-medium">{fmtMoney(t.value, { compact: true })}</td>
              <td className="text-right text-[11px] text-muted-foreground">{timeAgo(t.filedAt)}</td>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}
