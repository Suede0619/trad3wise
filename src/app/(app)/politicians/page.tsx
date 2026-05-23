import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PoliticianFeed } from "@/components/data/politician-feed";
import { listPoliticianTrades } from "@/lib/data";

export const metadata: Metadata = {
  title: "Politicians",
  description: "Congressional trade tracker — disclosures by members of the House and Senate.",
};

export default function PoliticiansPage() {
  return (
    <div>
      <PageHeader
        title="Congressional trades"
        description="Trades disclosed by members of Congress under the STOCK Act. Filter by party, chamber, and ticker."
      />
      <PoliticianFeed trades={listPoliticianTrades()} />
    </div>
  );
}
