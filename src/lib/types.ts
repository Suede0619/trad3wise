// Core domain types for Trad3wise. These mirror the data-provider contracts in src/lib/data.

export type Exchange = "NYSE" | "NASDAQ" | "ARCX" | "BATS" | "AMEX";

export interface Company {
  ticker: string;
  exchange: Exchange;
  name: string;
  sector: string;
  industry: string;
  marketCap: number;
  price: number;
  change: number; // % day change
  volume: number;
  employees: number;
  ceo: string;
  hq: string;
  description: string;
  signals: SignalFlag[];
}

export type SignalFlag =
  | "insider-buy"
  | "insider-sell"
  | "13f-add"
  | "13f-trim"
  | "dilution"
  | "politician-buy"
  | "unusual-volume"
  | "new-filing";

export interface Quote {
  ticker: string;
  price: number;
  change: number;
  changePct: number;
  spark: number[];
}

export type FilingType =
  | "10-K"
  | "10-Q"
  | "8-K"
  | "S-1"
  | "4"
  | "3"
  | "5"
  | "13F-HR"
  | "SC 13D"
  | "SC 13G"
  | "DEF 14A"
  | "424B5";

export interface Filing {
  id: string;
  type: FilingType;
  ticker: string;
  company: string;
  title: string;
  filedAt: string; // ISO
  summary: string; // AI-generated synopsis
  tags: string[]; // e.g. ROFR, dilution, financing
  url: string; // EDGAR link
  live?: boolean; // true when sourced live from SEC EDGAR
  cik?: string; // SEC CIK when known
}

export type TxnCode = "P" | "S" | "A" | "M" | "G" | "F";

export interface InsiderTransaction {
  id: string;
  insider: string;
  insiderSlug: string;
  role: string;
  ticker: string;
  company: string;
  type: "buy" | "sell";
  code: TxnCode;
  shares: number;
  price: number;
  value: number;
  filedAt: string;
  ownedAfter: number;
}

export interface Insider {
  slug: string;
  name: string;
  roles: string[];
  companies: string[];
  totalBought: number;
  totalSold: number;
  txns: InsiderTransaction[];
}

export interface PoliticianTrade {
  id: string;
  politician: string;
  politicianSlug: string;
  party: "D" | "R" | "I";
  chamber: "House" | "Senate";
  state: string;
  ticker: string;
  company: string;
  type: "buy" | "sell";
  amountRange: string;
  tradedAt: string;
  disclosedAt: string;
}

export interface Holding {
  ticker: string;
  company: string;
  shares: number;
  value: number;
  weight: number; // %
  changePct: number; // QoQ change in shares
  action: "new" | "add" | "trim" | "sold" | "hold";
}

export interface Institution {
  slug: string;
  name: string;
  aum: number;
  holdingsCount: number;
  lastFiled: string;
  topHoldings: Holding[];
}

export interface ETF {
  ticker: string;
  exchange: Exchange;
  name: string;
  issuer: string;
  category: string;
  aum: number;
  expenseRatio: number;
  price: number;
  change: number;
  flow1m: number; // net flow last month
  holdings: Holding[];
}

export interface NewsArticle {
  id: string;
  headline: string;
  source: string;
  url: string;
  publishedAt: string;
  tickers: string[];
  sentiment: "positive" | "neutral" | "negative";
  summary: string;
}

export interface Signal {
  id: string;
  kind: SignalFlag;
  ticker: string;
  company: string;
  headline: string;
  detail: string;
  at: string;
  strength: "high" | "medium" | "low";
}

export interface Report {
  id: string;
  title: string;
  ticker?: string;
  createdAt: string;
  status: "ready" | "generating";
  summary: string;
}

export interface AlertRule {
  id: string;
  name: string;
  type: SignalFlag | "price";
  target: string; // ticker or "any"
  condition: string;
  channels: ("inapp" | "email" | "push")[];
  active: boolean;
}

export interface PlanTier {
  id: "free" | "starter" | "professional" | "enterprise";
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}
