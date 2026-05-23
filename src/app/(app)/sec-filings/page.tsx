import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { FilingsFeed } from "@/components/data/filings-feed";
import { Badge } from "@/components/ui/badge";
import { getLatestFilings } from "@/lib/data";

export const metadata: Metadata = {
  title: "SEC Filings",
  description: "Real-time SEC filing feed with AI summaries and specialized lenses (ROFR, dilution, financing).",
};

// Revalidate the page so live EDGAR data stays fresh without hammering the SEC.
export const revalidate = 300;

export default async function SecFilingsPage() {
  const { filings, source } = await getLatestFilings(60);

  return (
    <div>
      <PageHeader
        title="SEC filings"
        description="A real-time feed of every filing, with AI summaries and specialized lenses for ROFR, dilution, financing, and more."
      >
        {source === "edgar" ? (
          <Badge variant="up">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-up" /> Live from SEC EDGAR
          </Badge>
        ) : (
          <Badge variant="warn">Sample data</Badge>
        )}
      </PageHeader>
      <FilingsFeed filings={filings} />
    </div>
  );
}
