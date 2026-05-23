"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PoliticianTrade } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

const partyVariant = { D: "info", R: "down", I: "outline" } as const;

export function PoliticianFeed({ trades }: { trades: PoliticianTrade[] }) {
  const [q, setQ] = useState("");
  const [party, setParty] = useState("all");
  const [chamber, setChamber] = useState("all");

  const rows = useMemo(
    () =>
      trades.filter((t) => {
        if (q && !`${t.politician} ${t.ticker} ${t.company}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (party !== "all" && t.party !== party) return false;
        if (chamber !== "all" && t.chamber !== chamber) return false;
        return true;
      }),
    [trades, q, party, chamber],
  );

  return (
    <Card>
      <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row">
        <Input placeholder="Search politician or ticker…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <Select value={party} onChange={(e) => setParty(e.target.value)}>
          <option value="all">All parties</option>
          <option value="D">Democrat</option>
          <option value="R">Republican</option>
          <option value="I">Independent</option>
        </Select>
        <Select value={chamber} onChange={(e) => setChamber(e.target.value)}>
          <option value="all">Both chambers</option>
          <option value="House">House</option>
          <option value="Senate">Senate</option>
        </Select>
        <span className="flex items-center text-xs text-muted-foreground sm:ml-auto">{rows.length} disclosures</span>
      </div>
      <Table>
        <THead>
          <tr>
            <th className="text-left">Politician</th>
            <th className="text-left">Ticker</th>
            <th className="text-left">Side</th>
            <th className="text-left">Amount</th>
            <th className="text-right">Traded</th>
            <th className="text-right">Disclosed</th>
          </tr>
        </THead>
        <TBody>
          {rows.slice(0, 60).map((t) => (
            <TR key={t.id}>
              <td>
                <Link href={`/politicians/${t.politicianSlug}`} className="flex items-center gap-2">
                  <Badge variant={partyVariant[t.party]}>{t.party}-{t.state}</Badge>
                  <span className="text-sm font-medium">{t.politician}</span>
                  <span className="text-[11px] text-muted-foreground">{t.chamber}</span>
                </Link>
              </td>
              <td><Link href={`/companies/NYSE:${t.ticker}`} className="font-mono text-sm hover:text-primary">{t.ticker}</Link></td>
              <td><Badge variant={t.type === "buy" ? "up" : "down"}>{t.type}</Badge></td>
              <td className="tnum text-muted-foreground">{t.amountRange}</td>
              <td className="text-right text-[11px] text-muted-foreground">{timeAgo(t.tradedAt)}</td>
              <td className="text-right text-[11px] text-muted-foreground">{timeAgo(t.disclosedAt)}</td>
            </TR>
          ))}
        </TBody>
      </Table>
    </Card>
  );
}
