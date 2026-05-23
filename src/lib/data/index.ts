/**
 * Data provider layer.
 *
 * Every page reads market data through these functions — never directly from a vendor SDK.
 * Today they return deterministic mock data. To go live, implement each function against a
 * real source (SEC EDGAR, a market-data API, a news API, a politician-trade API) behind the
 * same signature. See docs/SETUP.md for the accounts/keys required.
 */
import * as mock from "@/lib/mock/data";

export const dataSource: "mock" | "live" = process.env.MARKETDATA_API_KEY ? "live" : "mock";

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
