import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { PoliticianFeed } from "@/components/data/politician-feed";
import { Badge } from "@/components/ui/badge";
import { getPoliticianTradesLive } from "@/lib/data";

export const metadata: Metadata = {
  title: "Politicians",
  description: "Congressional trade tracker — disclosures by members of the House and Senate.",
};

export const revalidate = 3600;

export default async function PoliticiansPage() {
  const { trades, source } = await getPoliticianTradesLive();
  return (
    <div>
      <PageHeader
        title="Congressional trades"
        description="Trades disclosed by members of Congress under the STOCK Act. Filter by party, chamber, and ticker."
      >
        {source === "live" ? (
          <Badge variant="up"><span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-up" /> Live feed</Badge>
        ) : (
          <Badge variant="warn">Sample data</Badge>
        )}
      </PageHeader>
      <PoliticianFeed trades={trades} />
    </div>
  );
}
