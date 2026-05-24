import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { NewsList } from "@/components/data/news-list";
import { Badge } from "@/components/ui/badge";
import { getNewsLive } from "@/lib/data";

export const metadata: Metadata = {
  title: "News",
  description: "Aggregated market and company news with sentiment tagging.",
};

export const revalidate = 300;

export default async function NewsPage() {
  const { articles, source } = await getNewsLive();
  return (
    <div>
      <PageHeader title="Market news" description="Aggregated company and market news with sentiment tagging.">
        {source === "live" ? (
          <Badge variant="up"><span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-up" /> Live feed</Badge>
        ) : (
          <Badge variant="warn">Sample data</Badge>
        )}
      </PageHeader>
      <NewsList articles={articles} />
    </div>
  );
}
