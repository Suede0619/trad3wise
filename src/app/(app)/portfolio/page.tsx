import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Link2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Connect a brokerage to track your holdings against signals and filings.",
};

const BROKERS = ["Robinhood", "Fidelity", "Charles Schwab", "E*TRADE", "Interactive Brokers", "Webull"];

export default function PortfolioPage() {
  return (
    <div>
      <PageHeader title="Portfolio" description="Link a brokerage (read-only) to see your holdings alongside live signals and filings." />

      <Card className="mb-5">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Briefcase className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">No brokerage connected</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              Connect a brokerage to import positions and get signal alerts on what you actually hold.
              Read-only access via SnapTrade / Plaid (configure provider keys in docs/SETUP.md).
            </p>
          </div>
          <Button><Link2 className="h-4 w-4" /> Connect brokerage</Button>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" /> Read-only · we never place trades or move funds.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Supported brokerages</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {BROKERS.map((b) => <Badge key={b} variant="outline">{b}</Badge>)}
        </CardContent>
      </Card>
    </div>
  );
}
