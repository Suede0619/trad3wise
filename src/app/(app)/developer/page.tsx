"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/ui/stat";
import { Code2, Plus, Copy, Trash2, KeyRound } from "lucide-react";

type Key = { id: string; name: string; key: string; created: string; calls: number };

const ENDPOINTS = [
  { m: "GET", p: "/v1/companies", d: "List & screen companies" },
  { m: "GET", p: "/v1/companies/{ticker}/filings", d: "Filings for a company" },
  { m: "GET", p: "/v1/insiders/transactions", d: "Form 3/4/5 transactions" },
  { m: "GET", p: "/v1/institutions/{id}/holdings", d: "13F holdings" },
  { m: "GET", p: "/v1/politicians/trades", d: "Congressional trades" },
  { m: "POST", p: "/v1/ai/summary", d: "AI filing summary" },
];

function genKey() {
  return "t3_live_" + Array.from({ length: 32 }, () => "abcdef0123456789"[Math.floor(Math.random() * 16)]).join("");
}

export default function DeveloperPage() {
  const [keys, setKeys] = useState<Key[]>([
    { id: "k1", name: "Production", key: genKey(), created: "2026-04-02", calls: 18234 },
  ]);

  const add = () =>
    setKeys((k) => [{ id: `k${Date.now()}`, name: "New key", key: genKey(), created: new Date().toISOString().slice(0, 10), calls: 0 }, ...k]);
  const remove = (id: string) => setKeys((k) => k.filter((x) => x.id !== id));

  const totalCalls = keys.reduce((s, k) => s + k.calls, 0);

  return (
    <div>
      <PageHeader title="Developer" description="Issue API keys and access the Trad3wise REST API. API access requires the Professional plan.">
        <Button asChild variant="outline" size="sm"><Link href="/docs">API docs</Link></Button>
      </PageHeader>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="API calls (30d)" value={totalCalls.toLocaleString()} />
        <Stat label="Active keys" value={keys.length} />
        <Stat label="Rate limit" value="600 / min" />
        <Stat label="Plan" value={<span className="text-primary">Professional</span>} />
      </div>

      <Card className="mb-5">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> API keys</CardTitle>
          <Button size="sm" onClick={add}><Plus className="h-4 w-4" /> New key</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {keys.map((k) => (
            <div key={k.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
              <div className="min-w-0">
                <div className="text-sm font-medium">{k.name}</div>
                <code className="block truncate font-mono text-xs text-muted-foreground">{k.key}</code>
                <div className="mt-1 text-[11px] text-muted-foreground">Created {k.created} · {k.calls.toLocaleString()} calls</div>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard?.writeText(k.key)} aria-label="Copy"><Copy className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => remove(k.id)} aria-label="Revoke"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Code2 className="h-4 w-4" /> Endpoints</CardTitle></CardHeader>
        <CardContent className="space-y-1">
          {ENDPOINTS.map((e) => (
            <div key={e.p} className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-surface-2">
              <Badge variant={e.m === "GET" ? "info" : "primary"} className="font-mono">{e.m}</Badge>
              <code className="font-mono text-xs">{e.p}</code>
              <span className="ml-auto text-xs text-muted-foreground">{e.d}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
