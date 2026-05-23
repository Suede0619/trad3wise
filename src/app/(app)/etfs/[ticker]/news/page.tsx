import { notFound } from "next/navigation";
import { getETF, listNews } from "@/lib/data";
import { parseTicker } from "@/lib/utils";
import { NewsList } from "@/components/data/news-list";

export default async function ETFNewsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { ticker } = parseTicker(raw);
  const etf = getETF(ticker);
  if (!etf) notFound();

  // Surface news for the ETF's largest holdings as a proxy for fund-relevant coverage.
  const tickers = new Set(etf.holdings.slice(0, 5).map((h) => h.ticker));
  const news = listNews().filter((n) => n.tickers.some((t) => tickers.has(t)));
  return <NewsList articles={news} />;
}
