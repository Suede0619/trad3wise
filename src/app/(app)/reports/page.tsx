"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileBarChart, Sparkles, Loader2 } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import type { Report } from "@/lib/types";

const SEED: Report[] = [
  { id: "r1", title: "NVDA — Insider & institutional positioning", ticker: "NVDA", createdAt: new Date(Date.now() - 3600e3 * 6).toISOString(), status: "ready", summary: "Net insider activity skewed to sells on strength; three large funds added in the latest 13F cycle. No dilution language in recent filings." },
  { id: "r2", title: "Dilution watch — recent S-1 / 424B5 filers", createdAt: new Date(Date.now() - 3600e3 * 30).toISOString(), status: "ready", summary: "Six issuers filed shelf takedowns this week. Two carry above-average dilution risk based on offering size vs. float." },
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(SEED);
  const [ticker, setTicker] = useState("");
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    if (busy) return;
    setBusy(true);
    const id = `r${Date.now()}`;
    const draft: Report = {
      id,
      title: `${ticker ? ticker.toUpperCase() + " — " : ""}AI research report`,
      ticker: ticker.toUpperCase() || undefined,
      createdAt: new Date().toISOString(),
      status: "generating",
      summary: "",
    };
    setReports((r) => [draft, ...r]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: `Write a short research report${ticker ? " on " + ticker.toUpperCase() : ""} covering insider activity, institutional (13F) positioning, recent filings, and the key signal.` }],
        }),
      });
      const reader = res.body?.getReader();
      const dec = new TextDecoder();
      let acc = "";
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
      }
      setReports((rs) => rs.map((r) => (r.id === id ? { ...r, status: "ready", summary: acc } : r)));
    } catch {
      setReports((rs) => rs.map((r) => (r.id === id ? { ...r, status: "ready", summary: "Failed to generate." } : r)));
    } finally {
      setBusy(false);
      setTicker("");
    }
  };

  return (
    <div>
      <PageHeader title="AI research reports" description="On-demand deep-dives that combine filings, insider activity, and 13F positioning into a written brief." />

      <Card className="mb-5">
        <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
          <Input value={ticker} onChange={(e) => setTicker(e.target.value)} placeholder="Ticker (optional) — e.g. NVDA" className="sm:max-w-xs" />
          <Button onClick={generate} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {busy ? "Generating…" : "Generate report"}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {reports.map((r) => (
          <Card key={r.id}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2"><FileBarChart className="h-4 w-4 text-primary" /> {r.title}</CardTitle>
              <div className="flex items-center gap-2">
                {r.ticker && <Badge variant="outline" className="font-mono">{r.ticker}</Badge>}
                <Badge variant={r.status === "ready" ? "up" : "warn"}>{r.status}</Badge>
                <span className="text-[11px] text-muted-foreground">{timeAgo(r.createdAt)}</span>
              </div>
            </CardHeader>
            <CardContent>
              {r.status === "generating" ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Analyzing filings…</div>
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{r.summary}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
