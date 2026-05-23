import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { FilingsFeed } from "@/components/data/filings-feed";
import { listFilings } from "@/lib/data";

export const metadata: Metadata = {
  title: "SEC Filings",
  description: "Real-time SEC filing feed with AI summaries and specialized lenses (ROFR, dilution, financing).",
};

export default function SecFilingsPage() {
  return (
    <div>
      <PageHeader
        title="SEC filings"
        description="A real-time feed of every filing, with AI summaries and specialized lenses for ROFR, dilution, financing, and more."
      />
      <FilingsFeed filings={listFilings()} />
    </div>
  );
}
