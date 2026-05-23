import Link from "next/link";
import type { Filing } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";
import { Sparkles, ExternalLink } from "lucide-react";

export function FilingsList({ filings, showCompany = true }: { filings: Filing[]; showCompany?: boolean }) {
  if (!filings.length)
    return <p className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">No filings found.</p>;

  return (
    <div className="space-y-2">
      {filings.map((f) => (
        <div key={f.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono">{f.type}</Badge>
            {showCompany && (
              <Link href={`/companies/NYSE:${f.ticker}`} className="font-mono text-sm font-medium hover:text-primary">
                {f.ticker}
              </Link>
            )}
            <span className="text-sm text-muted-foreground">{f.company}</span>
            <span className="ml-auto text-[11px] text-muted-foreground">{timeAgo(f.filedAt)}</span>
          </div>
          <div className="mt-2 flex items-start gap-2">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <p className="text-sm text-muted-foreground">{f.summary}</p>
          </div>
          {f.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {f.tags.map((t, i) => <Badge key={i} variant="warn">{t}</Badge>)}
            </div>
          )}
          <div className="mt-3 flex gap-3 text-xs">
            <Link href={`/sec-filings/${f.id}`} className="text-primary hover:underline">Open filing →</Link>
            <a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              EDGAR <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
