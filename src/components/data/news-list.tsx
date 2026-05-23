import Link from "next/link";
import type { NewsArticle } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { timeAgo } from "@/lib/utils";

const SENT = {
  positive: "up",
  negative: "down",
  neutral: "outline",
} as const;

export function NewsList({ articles }: { articles: NewsArticle[] }) {
  if (!articles.length)
    return <p className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">No news found.</p>;

  return (
    <div className="space-y-2">
      {articles.map((n) => (
        <div key={n.id} className="rounded-lg border border-border bg-card p-4">
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground">{n.source}</span>
            <span>·</span>
            <span>{timeAgo(n.publishedAt)}</span>
            {n.tickers.map((t) => (
              <Link key={t} href={`/companies/NYSE:${t}`} className="font-mono text-primary hover:underline">{t}</Link>
            ))}
            <Badge variant={SENT[n.sentiment]} className="ml-auto">{n.sentiment}</Badge>
          </div>
          <p className="text-sm font-medium leading-snug">{n.headline}</p>
          <p className="mt-1 text-xs text-muted-foreground">{n.summary}</p>
        </div>
      ))}
    </div>
  );
}
