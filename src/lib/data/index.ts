/**
 * Data provider layer.
 *
 * Every page reads market data through these functions — never directly from a vendor SDK.
 * Today they return deterministic mock data. To go live, implement each function against a
 * real source (SEC EDGAR, a market-data API, a news API, a politician-trade API) behind the
 * same signature. See docs/SETUP.md for the accounts/keys required.
 */
import * as mock from "@/lib/mock/data";
import { fetchLatestFilings, fetchCompanyFilings, fetchCompanyFinancials, fetchCompanyInsiderTransactions } from "@/lib/edgar";
import type { Filing, InsiderTransaction } from "@/lib/types";

export const dataSource: "mock" | "live" = process.env.MARKETDATA_API_KEY ? "live" : "mock";

// EDGAR is free (no key), so live filings default ON. Set EDGAR_LIVE=off to force mock.
const edgarLive = process.env.EDGAR_LIVE !== "off";

/**
 * Latest filings — real SEC EDGAR feed when reachable, deterministic mock as fallback.
 * Returns `{ source }` so the UI can show a "live"/"sample" indicator.
 */
export async function getLatestFilings(
  limit = 40,
): Promise<{ filings: Filing[]; source: "edgar" | "mock" }> {
  if (edgarLive) {
    try {
      const filings = await fetchLatestFilings(limit);
      return { filings, source: "edgar" };
    } catch {
      // fall through to mock on any network/parse failure
    }
  }
  return { filings: mock.getFilings().slice(0, limit), source: "mock" };
}

/** A single company's filings — real EDGAR submissions when reachable, else mock. */
export async function getCompanyFilings(
  ticker: string,
  limit = 30,
): Promise<{ filings: Filing[]; source: "edgar" | "mock" }> {
  if (edgarLive) {
    try {
      const filings = await fetchCompanyFilings(ticker, limit);
      if (filings.length) return { filings, source: "edgar" };
    } catch {
      /* fall back */
    }
  }
  return { filings: mock.getFilings().filter((f) => f.ticker === ticker), source: "mock" };
}

/** A company's annual financials — real XBRL company facts when available, else mock. */
export async function getCompanyFinancials(
  ticker: string,
): Promise<{ rows: ReturnType<typeof mock.getFinancials>; source: "edgar" | "mock" }> {
  if (edgarLive) {
    try {
      const rows = await fetchCompanyFinancials(ticker);
      if (rows.length >= 2) return { rows, source: "edgar" };
    } catch {
      /* fall back */
    }
  }
  return { rows: mock.getFinancials(ticker), source: "mock" };
}

// Companies
export const listCompanies = () => mock.getCompanies();
export const getCompany = (exchange: string, ticker: string) => mock.getCompany(exchange, ticker);
export const findCompany = (ticker: string) => mock.findCompany(ticker);
export const getFinancials = (ticker: string) => mock.getFinancials(ticker);
export const getPriceSeries = (ticker: string, n?: number) => mock.priceSeries(ticker, n);
export const getSpark = (ticker: string) => mock.getSpark(ticker);

// Filings
export const listFilings = () => mock.getFilings();
export const getFiling = (id: string) => mock.getFiling(id);

// Insiders
export const listInsiderTransactions = () => mock.getInsiderTransactions();
export const listInsiders = () => mock.getInsiders();
export const getInsider = (slug: string) => mock.getInsider(slug);

/** A company's insider (Form 4) transactions — real EDGAR when reachable, else mock. */
export async function getCompanyInsiders(
  ticker: string,
  limit = 12,
): Promise<{ txns: InsiderTransaction[]; source: "edgar" | "mock" }> {
  if (edgarLive) {
    try {
      const txns = await fetchCompanyInsiderTransactions(ticker, limit);
      if (txns.length) return { txns, source: "edgar" };
    } catch {
      /* fall back */
    }
  }
  return {
    txns: mock.getInsiderTransactions().filter((t) => t.ticker === ticker),
    source: "mock",
  };
}

// Politicians
export const listPoliticianTrades = () => mock.getPoliticianTrades();
export const getPolitician = (slug: string) => mock.getPolitician(slug);

// Institutions
export const listInstitutions = () => mock.getInstitutions();
export const getInstitution = (slug: string) => mock.getInstitution(slug);

// ETFs
export const listETFs = () => mock.getETFs();
export const getETF = (ticker: string) => mock.getETF(ticker);

// News & signals
export const listNews = () => mock.getNews();
export const listSignals = () => mock.getSignals();
export const getMovers = () => mock.getMovers();
