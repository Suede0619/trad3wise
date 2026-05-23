import { notFound } from "next/navigation";
import { getCompany, getCompanyFilings } from "@/lib/data";
import { parseTicker } from "@/lib/utils";
import { FilingsList } from "@/components/data/filings-list";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

export default async function CompanyFilingsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { exchange, ticker } = parseTicker(raw);
  const company = getCompany(exchange, ticker) ?? getCompany("NASDAQ", ticker) ?? getCompany("NYSE", ticker);
  if (!company) notFound();

  const { filings, source } = await getCompanyFilings(company.ticker);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        {source === "edgar" ? (
          <Badge variant="up"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-up" /> Live from SEC EDGAR</Badge>
        ) : (
          <Badge variant="warn">Sample data</Badge>
        )}
      </div>
      <FilingsList filings={filings} showCompany={false} />
    </div>
  );
}
