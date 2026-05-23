"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Company } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { SignalBadge } from "@/components/shared/signal-badge";
import { fmtMoney, fmtPct, fmtCompact, changeColor, cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

type SortKey = "name" | "price" | "change" | "marketCap" | "volume";
const PAGE = 12;

export function CompanyScreener({
  companies,
  sectors,
}: {
  companies: Company[];
  sectors: string[];
}) {
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("all");
  const [cap, setCap] = useState("all");
  const [sort, setSort] = useState<SortKey>("marketCap");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = companies.filter((c) => {
      if (q && !`${c.ticker} ${c.name}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (sector !== "all" && c.sector !== sector) return false;
      if (cap === "mega" && c.marketCap < 2e11) return false;
      if (cap === "large" && (c.marketCap < 1e10 || c.marketCap >= 2e11)) return false;
      if (cap === "mid" && c.marketCap >= 1e10) return false;
      return true;
    });
    rows = [...rows].sort((a, b) => {
      const av = a[sort];
      const bv = b[sort];
      const cmp = typeof av === "string" ? av.localeCompare(bv as string) : (av as number) - (bv as number);
      return dir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [companies, q, sector, cap, sort, dir]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const cur = Math.min(page, pages - 1);
  const rows = filtered.slice(cur * PAGE, cur * PAGE + PAGE);

  const toggleSort = (k: SortKey) => {
    if (sort === k) setDir(dir === "asc" ? "desc" : "asc");
    else {
      setSort(k);
      setDir("desc");
    }
    setPage(0);
  };

  const Th = ({ k, label, align = "right" }: { k: SortKey; label: string; align?: "left" | "right" }) => (
    <th>
      <button
        onClick={() => toggleSort(k)}
        className={cn("inline-flex items-center gap-1 hover:text-foreground", align === "right" && "flex-row-reverse")}
      >
        {label}
        {sort === k && (dir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
      </button>
    </th>
  );

  return (
    <Card>
      <div className="flex flex-col gap-2 border-b border-border p-3 sm:flex-row">
        <Input
          placeholder="Search ticker or company…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(0);
          }}
          className="sm:max-w-xs"
        />
        <Select value={sector} onChange={(e) => { setSector(e.target.value); setPage(0); }}>
          <option value="all">All sectors</option>
          {sectors.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
        <Select value={cap} onChange={(e) => { setCap(e.target.value); setPage(0); }}>
          <option value="all">Any market cap</option>
          <option value="mega">Mega (&gt;$200B)</option>
          <option value="large">Large ($10B–$200B)</option>
          <option value="mid">Mid (&lt;$10B)</option>
        </Select>
        <div className="flex items-center text-xs text-muted-foreground sm:ml-auto">
          {filtered.length} results
        </div>
      </div>

      <Table>
        <THead>
          <tr>
            <Th k="name" label="Company" align="left" />
            <Th k="price" label="Price" />
            <Th k="change" label="Chg %" />
            <Th k="marketCap" label="Mkt Cap" />
            <Th k="volume" label="Volume" />
            <th className="text-left">Signals</th>
          </tr>
        </THead>
        <TBody>
          {rows.map((c) => (
            <TR key={c.ticker}>
              <td>
                <Link href={`/companies/${c.exchange}:${c.ticker}`} className="block">
                  <span className="font-mono text-sm font-medium">{c.ticker}</span>
                  <span className="block truncate text-xs text-muted-foreground max-w-[200px]">{c.name}</span>
                </Link>
              </td>
              <td className="text-right tnum">${c.price.toFixed(2)}</td>
              <td className={cn("text-right tnum", changeColor(c.change))}>{fmtPct(c.change)}</td>
              <td className="text-right tnum text-muted-foreground">{fmtMoney(c.marketCap, { compact: true })}</td>
              <td className="text-right tnum text-muted-foreground">{fmtCompact(c.volume)}</td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {c.signals.length ? c.signals.map((s, i) => <SignalBadge key={i} kind={s} />) : <Badge variant="outline">—</Badge>}
                </div>
              </td>
            </TR>
          ))}
        </TBody>
      </Table>

      <div className="flex items-center justify-between border-t border-border p-3 text-xs text-muted-foreground">
        <span>Page {cur + 1} of {pages}</span>
        <div className="flex gap-2">
          <button disabled={cur === 0} onClick={() => setPage(cur - 1)} className="rounded border border-border px-2 py-1 disabled:opacity-40 hover:bg-surface-2">Prev</button>
          <button disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)} className="rounded border border-border px-2 py-1 disabled:opacity-40 hover:bg-surface-2">Next</button>
        </div>
      </div>
    </Card>
  );
}
