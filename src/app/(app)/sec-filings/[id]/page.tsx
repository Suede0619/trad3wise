import { notFound } from "next/navigation";
import Link from "next/link";
import { getFiling } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AISummaryButton } from "@/components/data/ai-summary";
import { timeAgo } from "@/lib/utils";
import { ExternalLink, Sparkles } from "lucide-react";

export default async function FilingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filing = getFiling(decodeURIComponent(id));
  if (!filing) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono">Form {filing.type}</Badge>
        <Link href={`/companies/NYSE:${filing.ticker}`} className="font-mono text-sm font-medium hover:text-primary">
          {filing.ticker}
        </Link>
        <span className="text-sm text-muted-foreground">{filing.company}</span>
        <span className="ml-auto text-xs text-muted-foreground">Filed {timeAgo(filing.filedAt)}</span>
      </div>

      <h1 className="text-xl font-semibold">{filing.title}</h1>

      {filing.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {filing.tags.map((t, i) => <Badge key={i} variant="warn">{t}</Badge>)}
        </div>
      )}

      <Card>
        <CardHeader className="flex-row items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <CardTitle>AI summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">{filing.summary}</p>
          <AISummaryButton filingId={filing.id} ticker={filing.ticker} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Original document</CardTitle></CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            View the full filing on SEC EDGAR. Connect the EDGAR provider (docs/SETUP.md) to render the
            original document inline with extracted provisions.
          </p>
          <Button variant="outline" size="sm" asChild>
            <a href={filing.url} target="_blank" rel="noopener noreferrer">
              Open on EDGAR <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
