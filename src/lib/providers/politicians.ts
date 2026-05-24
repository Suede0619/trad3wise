/**
 * Politician (congressional) trade provider — activates when POLITICIAN_API_KEY is set.
 * Default vendor: Finnhub congressional-trading (https://finnhub.io). Override base with
 * POLITICIAN_BASE_URL. With no key, callers fall back to mock data.
 *
 * NOTE: this endpoint is vendor-specific and may be premium; gated by your key, defensive
 * fallback on any failure. Verify the vendor's response shape before relying on it.
 */
import type { PoliticianTrade } from "@/lib/types";
import { slugify } from "@/lib/utils";

const KEY = process.env.POLITICIAN_API_KEY;
const BASE = process.env.POLITICIAN_BASE_URL || "https://finnhub.io/api/v1";

export const politiciansEnabled = Boolean(KEY);

type FinnhubCongress = {
  name: string;
  symbol: string;
  transactionDate: string;
  filingDate: string;
  amountFrom?: number;
  amountTo?: number;
  transactionType?: string; // "Purchase" | "Sale" | ...
  ownerType?: string;
  position?: string; // chamber/party hints vary by vendor
};

function amountRange(from?: number, to?: number): string {
  if (from == null && to == null) return "—";
  const f = (n?: number) => (n == null ? "?" : n >= 1e6 ? `$${(n / 1e6).toFixed(0)}M` : `$${(n / 1e3).toFixed(0)}K`);
  return `${f(from)}–${f(to)}`;
}

/** Fetch recent congressional trades for the given symbols. Returns [] on failure/no key. */
export async function fetchPoliticianTrades(symbols: string[]): Promise<PoliticianTrade[]> {
  if (!KEY || !symbols.length) return [];
  const out: PoliticianTrade[] = [];
  try {
    // Finnhub's congressional-trading endpoint is symbol-scoped; query a handful of symbols.
    const results = await Promise.all(
      symbols.slice(0, 12).map(async (sym) => {
        const res = await fetch(`${BASE}/stock/congressional-trading?symbol=${encodeURIComponent(sym)}&token=${KEY}`, {
          next: { revalidate: 3600 },
        });
        if (!res.ok) return [] as FinnhubCongress[];
        const json = await res.json();
        return (json?.data ?? []) as FinnhubCongress[];
      }),
    );
    results.flat().forEach((t, i) => {
      const isBuy = (t.transactionType || "").toLowerCase().includes("purchase");
      out.push({
        id: `live-pol-${i}`,
        politician: t.name,
        politicianSlug: slugify(t.name || `unknown-${i}`),
        party: "I",
        chamber: (t.position || "").toLowerCase().includes("senate") ? "Senate" : "House",
        state: "—",
        ticker: t.symbol,
        company: t.symbol,
        type: isBuy ? "buy" : "sell",
        amountRange: amountRange(t.amountFrom, t.amountTo),
        tradedAt: t.transactionDate ? new Date(t.transactionDate).toISOString() : new Date().toISOString(),
        disclosedAt: t.filingDate ? new Date(t.filingDate).toISOString() : new Date().toISOString(),
      });
    });
  } catch {
    return [];
  }
  return out.sort((a, b) => +new Date(b.disclosedAt) - +new Date(a.disclosedAt));
}
