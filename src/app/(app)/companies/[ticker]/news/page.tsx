import { notFound } from "next/navigation";
import { getCompany, listNews } from "@/lib/data";
import { parseTicker } from "@/lib/utils";
import { NewsList } from "@/components/data/news-list";

export default async function CompanyNewsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { exchange, ticker } = parseTicker(raw);
  const company = getCompany(exchange, ticker) ?? getCompany("NASDAQ", ticker) ?? getCompany("NYSE", ticker);
  if (!company) notFound();

  const news = listNews().filter((n) => n.tickers.includes(company.ticker));
  return <NewsList articles={news} />;
}
