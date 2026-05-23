import { notFound } from "next/navigation";
import { getETF } from "@/lib/data";
import { parseTicker } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoldingsTable } from "@/components/data/holdings-table";

export default async function ETFHoldingsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { ticker } = parseTicker(raw);
  const etf = getETF(ticker);
  if (!etf) notFound();

  return (
    <Card>
      <CardHeader><CardTitle>Constituent holdings</CardTitle></CardHeader>
      <CardContent className="p-0">
        <HoldingsTable holdings={etf.holdings} />
      </CardContent>
    </Card>
  );
}
