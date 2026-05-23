"use client";

import { useMemo, useState } from "react";
import type { Filing } from "@/lib/types";
import { FilingsList } from "@/components/data/filings-list";
import { Input, Select } from "@/components/ui/input";
import { FILING_TYPES } from "@/lib/config";

const LENSES = ["ROFR", "dilution", "financing", "M&A", "buyback"];

export function FilingsFeed({ filings }: { filings: Filing[] }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [lens, setLens] = useState("all");

  const rows = useMemo(
    () =>
      filings.filter((f) => {
        if (q && !`${f.ticker} ${f.company}`.toLowerCase().includes(q.toLowerCase())) return false;
        if (type !== "all" && f.type !== type) return false;
        if (lens !== "all" && !f.tags.includes(lens)) return false;
        return true;
      }),
    [filings, q, type, lens],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input placeholder="Filter by ticker or company…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All form types</option>
          {FILING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </Select>
        <Select value={lens} onChange={(e) => setLens(e.target.value)}>
          <option value="all">All lenses</option>
          {LENSES.map((l) => <option key={l} value={l}>{l}</option>)}
        </Select>
        <span className="flex items-center text-xs text-muted-foreground sm:ml-auto">{rows.length} filings</span>
      </div>
      <FilingsList filings={rows} />
    </div>
  );
}
