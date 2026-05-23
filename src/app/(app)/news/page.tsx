import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { NewsList } from "@/components/data/news-list";
import { listNews } from "@/lib/data";

export const metadata: Metadata = {
  title: "News",
  description: "Aggregated market and company news with sentiment tagging.",
};

export default function NewsPage() {
  return (
    <div>
      <PageHeader title="Market news" description="Aggregated company and market news with sentiment tagging." />
      <NewsList articles={listNews()} />
    </div>
  );
}
