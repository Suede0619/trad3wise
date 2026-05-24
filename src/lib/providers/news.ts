/**
 * News provider (real market/company news) — activates when NEWS_API_KEY is set.
 * Default vendor: Finnhub (https://finnhub.io). Override base with NEWS_BASE_URL.
 * With no key, callers fall back to mock data.
 *
 * NOTE: gated by your key and not exercised by the mock-only default; verify the vendor's
 * current response shape before relying on it.
 */
import type { NewsArticle } from "@/lib/types";

const KEY = process.env.NEWS_API_KEY;
const BASE = process.env.NEWS_BASE_URL || "https://finnhub.io/api/v1";

export const newsEnabled = Boolean(KEY);

type FinnhubNews = {
  id: number;
  headline: string;
  source: string;
  url: string;
  datetime: number; // unix seconds
  summary: string;
  related?: string;
};

/** Fetch latest general market news. Returns [] on failure/no key. */
export async function fetchMarketNews(): Promise<NewsArticle[]> {
  if (!KEY) return [];
  try {
    const res = await fetch(`${BASE}/news?category=general&token=${KEY}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const rows = (await res.json()) as FinnhubNews[];
    return rows.slice(0, 60).map((n) => ({
      id: String(n.id),
      headline: n.headline,
      source: n.source,
      url: n.url,
      publishedAt: new Date((n.datetime || 0) * 1000).toISOString(),
      tickers: n.related ? n.related.split(",").filter(Boolean) : [],
      sentiment: "neutral" as const,
      summary: n.summary || n.headline,
    }));
  } catch {
    return [];
  }
}
