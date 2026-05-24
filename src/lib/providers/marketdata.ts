/**
 * Market-data provider (real quotes/fundamentals) — activates when MARKETDATA_API_KEY is set.
 * Default vendor: Financial Modeling Prep (https://financialmodelingprep.com). Override the base
 * with MARKETDATA_BASE_URL. With no key, callers fall back to mock data.
 *
 * NOTE: this path is gated by your key and is not exercised by the mock-only default; verify
 * against your chosen vendor's current response shape before relying on it in production.
 */
const KEY = process.env.MARKETDATA_API_KEY;
const BASE = process.env.MARKETDATA_BASE_URL || "https://financialmodelingprep.com/api/v3";

export const marketDataEnabled = Boolean(KEY);

export interface LiveQuote {
  price: number;
  change: number; // % day change
  marketCap?: number;
  volume?: number;
}

/** Batch-fetch quotes for tickers. Returns a ticker→quote map (empty on failure/no key). */
export async function fetchQuotes(tickers: string[]): Promise<Map<string, LiveQuote>> {
  const out = new Map<string, LiveQuote>();
  if (!KEY || !tickers.length) return out;
  try {
    const symbols = tickers.join(",");
    const res = await fetch(`${BASE}/quote/${encodeURIComponent(symbols)}?apikey=${KEY}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return out;
    const rows = (await res.json()) as Array<{
      symbol: string;
      price: number;
      changesPercentage: number;
      marketCap?: number;
      volume?: number;
    }>;
    for (const r of rows) {
      if (!r?.symbol || typeof r.price !== "number") continue;
      out.set(r.symbol.toUpperCase(), {
        price: r.price,
        change: Number(r.changesPercentage ?? 0),
        marketCap: r.marketCap,
        volume: r.volume,
      });
    }
  } catch {
    /* swallow — caller falls back to mock */
  }
  return out;
}
