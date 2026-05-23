import { notFound } from "next/navigation";
import { getCompany, listFilings } from "@/lib/data";
import { parseTicker } from "@/lib/utils";
import { FilingsList } from "@/components/data/filings-list";

export default async function CompanyFilingsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { exchange, ticker } = parseTicker(raw);
  const company = getCompany(exchange, ticker) ?? getCompany("NASDAQ", ticker) ?? getCompany("NYSE", ticker);
  if (!company) notFound();

  const filings = listFilings().filter((f) => f.ticker === company.ticker);
  return <FilingsList filings={filings} showCompany={false} />;
}
