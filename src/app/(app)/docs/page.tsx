import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "API Docs",
  description: "Trad3wise REST API reference.",
};

const ENDPOINTS = [
  { m: "GET", p: "/v1/companies", d: "List & screen companies. Query: sector, marketCapMin, q, sort, page." },
  { m: "GET", p: "/v1/companies/{ticker}", d: "Company overview, quote, and key stats." },
  { m: "GET", p: "/v1/companies/{ticker}/financials", d: "Reported financials from SEC filings." },
  { m: "GET", p: "/v1/companies/{ticker}/filings", d: "All filings for a company." },
  { m: "GET", p: "/v1/filings", d: "Global filing feed. Query: type, ticker, lens, since." },
  { m: "GET", p: "/v1/insiders/transactions", d: "Form 3/4/5 transactions. Query: ticker, side, minValue." },
  { m: "GET", p: "/v1/institutions/{id}/holdings", d: "13F holdings with QoQ deltas." },
  { m: "GET", p: "/v1/etfs/{ticker}/holdings", d: "ETF constituent holdings." },
  { m: "GET", p: "/v1/politicians/trades", d: "Congressional trade disclosures." },
  { m: "POST", p: "/v1/ai/summary", d: "Generate an AI summary for a filing id." },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="API documentation" description="Programmatic access to filings, insiders, institutions, ETFs, and politician trades." />

      <Card className="mb-5">
        <CardHeader><CardTitle>Authentication</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>All requests require a bearer token. Create one on the <Link href="/developer" className="text-primary hover:underline">Developer</Link> page (Professional plan).</p>
          <pre className="overflow-x-auto rounded-md border border-border bg-surface p-3 font-mono text-xs text-foreground">{`curl https://api.trad3wise.app/v1/insiders/transactions?ticker=NVDA \\
  -H "Authorization: Bearer t3_live_xxx"`}</pre>
          <p>Base URL: <code className="font-mono text-foreground">https://api.trad3wise.app</code> · Rate limit: 600 req/min (Professional).</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Endpoints</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {ENDPOINTS.map((e) => (
            <div key={e.p} className="rounded-md border border-border p-3">
              <div className="flex items-center gap-2">
                <Badge variant={e.m === "GET" ? "info" : "primary"} className="font-mono">{e.m}</Badge>
                <code className="font-mono text-xs text-foreground">{e.p}</code>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{e.d}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
