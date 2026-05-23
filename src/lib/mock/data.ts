import type {
  Company,
  Filing,
  FilingType,
  Insider,
  InsiderTransaction,
  Institution,
  PoliticianTrade,
  ETF,
  NewsArticle,
  Signal,
  Holding,
  Exchange,
  SignalFlag,
} from "@/lib/types";
import { slugify } from "@/lib/utils";
import {
  makeRng,
  hashStr,
  pick,
  range,
  intRange,
  sparkline,
  ago,
} from "./seed";

interface Seed {
  ticker: string;
  exchange: Exchange;
  name: string;
  sector: string;
  industry: string;
  ceo: string;
  hq: string;
}

const SEEDS: Seed[] = [
  { ticker: "NVDA", exchange: "NASDAQ", name: "NVIDIA Corporation", sector: "Technology", industry: "Semiconductors", ceo: "Jensen Huang", hq: "Santa Clara, CA" },
  { ticker: "AAPL", exchange: "NASDAQ", name: "Apple Inc.", sector: "Technology", industry: "Consumer Electronics", ceo: "Tim Cook", hq: "Cupertino, CA" },
  { ticker: "MSFT", exchange: "NASDAQ", name: "Microsoft Corporation", sector: "Technology", industry: "Software", ceo: "Satya Nadella", hq: "Redmond, WA" },
  { ticker: "AMZN", exchange: "NASDAQ", name: "Amazon.com, Inc.", sector: "Consumer Discretionary", industry: "Internet Retail", ceo: "Andy Jassy", hq: "Seattle, WA" },
  { ticker: "GOOGL", exchange: "NASDAQ", name: "Alphabet Inc.", sector: "Communication Services", industry: "Internet Content", ceo: "Sundar Pichai", hq: "Mountain View, CA" },
  { ticker: "META", exchange: "NASDAQ", name: "Meta Platforms, Inc.", sector: "Communication Services", industry: "Internet Content", ceo: "Mark Zuckerberg", hq: "Menlo Park, CA" },
  { ticker: "TSLA", exchange: "NASDAQ", name: "Tesla, Inc.", sector: "Consumer Discretionary", industry: "Auto Manufacturers", ceo: "Elon Musk", hq: "Austin, TX" },
  { ticker: "JPM", exchange: "NYSE", name: "JPMorgan Chase & Co.", sector: "Financials", industry: "Banks", ceo: "Jamie Dimon", hq: "New York, NY" },
  { ticker: "MS", exchange: "NYSE", name: "Morgan Stanley", sector: "Financials", industry: "Capital Markets", ceo: "Ted Pick", hq: "New York, NY" },
  { ticker: "GS", exchange: "NYSE", name: "The Goldman Sachs Group, Inc.", sector: "Financials", industry: "Capital Markets", ceo: "David Solomon", hq: "New York, NY" },
  { ticker: "BRK.B", exchange: "NYSE", name: "Berkshire Hathaway Inc.", sector: "Financials", industry: "Insurance", ceo: "Warren Buffett", hq: "Omaha, NE" },
  { ticker: "XOM", exchange: "NYSE", name: "Exxon Mobil Corporation", sector: "Energy", industry: "Oil & Gas", ceo: "Darren Woods", hq: "Spring, TX" },
  { ticker: "CVX", exchange: "NYSE", name: "Chevron Corporation", sector: "Energy", industry: "Oil & Gas", ceo: "Mike Wirth", hq: "San Ramon, CA" },
  { ticker: "UNH", exchange: "NYSE", name: "UnitedHealth Group Inc.", sector: "Health Care", industry: "Healthcare Plans", ceo: "Andrew Witty", hq: "Minnetonka, MN" },
  { ticker: "LLY", exchange: "NYSE", name: "Eli Lilly and Company", sector: "Health Care", industry: "Drug Manufacturers", ceo: "David Ricks", hq: "Indianapolis, IN" },
  { ticker: "JNJ", exchange: "NYSE", name: "Johnson & Johnson", sector: "Health Care", industry: "Drug Manufacturers", ceo: "Joaquin Duato", hq: "New Brunswick, NJ" },
  { ticker: "WMT", exchange: "NYSE", name: "Walmart Inc.", sector: "Consumer Staples", industry: "Discount Stores", ceo: "Doug McMillon", hq: "Bentonville, AR" },
  { ticker: "PG", exchange: "NYSE", name: "The Procter & Gamble Company", sector: "Consumer Staples", industry: "Household Products", ceo: "Jon Moeller", hq: "Cincinnati, OH" },
  { ticker: "KO", exchange: "NYSE", name: "The Coca-Cola Company", sector: "Consumer Staples", industry: "Beverages", ceo: "James Quincey", hq: "Atlanta, GA" },
  { ticker: "HD", exchange: "NYSE", name: "The Home Depot, Inc.", sector: "Consumer Discretionary", industry: "Home Improvement", ceo: "Ted Decker", hq: "Atlanta, GA" },
  { ticker: "BA", exchange: "NYSE", name: "The Boeing Company", sector: "Industrials", industry: "Aerospace & Defense", ceo: "Kelly Ortberg", hq: "Arlington, VA" },
  { ticker: "CAT", exchange: "NYSE", name: "Caterpillar Inc.", sector: "Industrials", industry: "Farm & Heavy Machinery", ceo: "Jim Umpleby", hq: "Irving, TX" },
  { ticker: "AMD", exchange: "NASDAQ", name: "Advanced Micro Devices, Inc.", sector: "Technology", industry: "Semiconductors", ceo: "Lisa Su", hq: "Santa Clara, CA" },
  { ticker: "PLTR", exchange: "NASDAQ", name: "Palantir Technologies Inc.", sector: "Technology", industry: "Software", ceo: "Alex Karp", hq: "Denver, CO" },
];

const ALL_FLAGS: SignalFlag[] = [
  "insider-buy",
  "insider-sell",
  "13f-add",
  "13f-trim",
  "dilution",
  "politician-buy",
  "unusual-volume",
  "new-filing",
];

let _companies: Company[] | null = null;

export function getCompanies(): Company[] {
  if (_companies) return _companies;
  _companies = SEEDS.map((s) => {
    const rng = makeRng(hashStr(s.ticker));
    const price = range(rng, 25, 950);
    const change = range(rng, -6, 6);
    const flags: SignalFlag[] = [];
    const flagCount = intRange(rng, 0, 3);
    for (let i = 0; i < flagCount; i++) flags.push(pick(rng, ALL_FLAGS));
    return {
      ...s,
      marketCap: Math.round(range(rng, 8e9, 3.4e12)),
      price: Number(price.toFixed(2)),
      change: Number(change.toFixed(2)),
      volume: Math.round(range(rng, 2e6, 9e7)),
      employees: intRange(rng, 2_000, 1_600_000),
      description: `${s.name} is a leading ${s.industry.toLowerCase()} company in the ${s.sector} sector, headquartered in ${s.hq}.`,
      signals: Array.from(new Set(flags)),
    };
  });
  return _companies;
}

export function getCompany(exchange: string, ticker: string): Company | undefined {
  return getCompanies().find(
    (c) =>
      c.ticker.toLowerCase() === ticker.toLowerCase() &&
      c.exchange.toLowerCase() === exchange.toLowerCase(),
  );
}

export function findCompany(ticker: string): Company | undefined {
  return getCompanies().find((c) => c.ticker.toLowerCase() === ticker.toLowerCase());
}

export function priceSeries(ticker: string, n = 90): { t: string; p: number }[] {
  const rng = makeRng(hashStr(ticker + "series"));
  const c = findCompany(ticker);
  let p = c ? c.price * 0.85 : 100;
  const out = [];
  for (let i = n; i >= 0; i--) {
    p += (rng() - 0.48) * (p * 0.03);
    p = Math.max(1, p);
    out.push({ t: ago(i * 60 * 24), p: Number(p.toFixed(2)) });
  }
  return out;
}

export function getSpark(ticker: string): number[] {
  const rng = makeRng(hashStr(ticker));
  const c = findCompany(ticker);
  return sparkline(rng, 24, c ? c.change : 0);
}

// ---- Financials ----
export function getFinancials(ticker: string) {
  const rng = makeRng(hashStr(ticker + "fin"));
  const base = range(rng, 8e9, 4e11);
  const years = ["2022", "2023", "2024", "2025"];
  return years.map((y, i) => {
    const rev = base * (1 + i * range(rng, 0.04, 0.22));
    const margin = range(rng, 0.08, 0.34);
    return {
      year: y,
      revenue: Math.round(rev),
      grossProfit: Math.round(rev * range(rng, 0.3, 0.7)),
      netIncome: Math.round(rev * margin),
      eps: Number(range(rng, 1.2, 14).toFixed(2)),
      fcf: Math.round(rev * range(rng, 0.05, 0.25)),
      assets: Math.round(rev * range(rng, 1.2, 3)),
      liabilities: Math.round(rev * range(rng, 0.5, 1.8)),
    };
  });
}

// ---- Filings ----
const FILING_TYPES: FilingType[] = ["10-K", "10-Q", "8-K", "S-1", "4", "3", "13F-HR", "SC 13D", "SC 13G", "DEF 14A", "424B5"];
const TAG_POOL = ["ROFR", "dilution", "financing", "M&A", "executive change", "guidance", "litigation", "buyback", "dividend", "counsel: Wachtell", "counterparty"];

const FILING_SUMMARY: Record<string, string> = {
  "10-K": "Annual report. Revenue and margins expanded YoY; management flagged supply concentration and FX exposure in risk factors. No new dilution authorized.",
  "10-Q": "Quarterly report. Sequential revenue growth with stable operating margin; guidance reiterated for the full year.",
  "8-K": "Material event disclosure: a leadership transition and a new commercial agreement were announced after market close.",
  "S-1": "Registration statement for a proposed offering. Use of proceeds is general corporate purposes; underwriters granted a customary over-allotment option.",
  "4": "Insider transaction (Form 4): a corporate officer reported an open-market change in beneficial ownership.",
  "3": "Initial statement of beneficial ownership by a newly-reporting insider.",
  "13F-HR": "Quarterly institutional holdings report disclosing equity positions as of the period end.",
  "SC 13D": "Activist-style beneficial ownership exceeding 5%, with stated intent to engage management.",
  "SC 13G": "Passive beneficial ownership exceeding 5%, filed by an institutional holder.",
  "DEF 14A": "Definitive proxy statement covering director elections, executive compensation, and shareholder proposals.",
  "424B5": "Prospectus supplement for a shelf takedown; pricing terms and net proceeds are disclosed.",
};

let _filings: Filing[] | null = null;
export function getFilings(): Filing[] {
  if (_filings) return _filings;
  const out: Filing[] = [];
  const companies = getCompanies();
  companies.forEach((c, ci) => {
    const rng = makeRng(hashStr(c.ticker + "filings"));
    const count = intRange(rng, 3, 7);
    for (let i = 0; i < count; i++) {
      const type = pick(rng, FILING_TYPES);
      const tags: string[] = [];
      const tagN = intRange(rng, 0, 2);
      for (let t = 0; t < tagN; t++) tags.push(pick(rng, TAG_POOL));
      out.push({
        id: `${c.ticker}-${type}-${i}`,
        type,
        ticker: c.ticker,
        company: c.name,
        title: `${c.name} files Form ${type}`,
        filedAt: ago(intRange(rng, 5, 60 * 24 * 30) + ci * 11),
        summary: FILING_SUMMARY[type] ?? "Filing submitted to the SEC.",
        tags: Array.from(new Set(tags)),
        url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company=${encodeURIComponent(c.name)}`,
      });
    }
  });
  out.sort((a, b) => +new Date(b.filedAt) - +new Date(a.filedAt));
  _filings = out;
  return out;
}

export function getFiling(id: string): Filing | undefined {
  return getFilings().find((f) => f.id === id);
}

// ---- Insiders ----
const FIRST = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Susan", "Min", "Clay", "Dustin", "Grace", "Howard"];
const LAST = ["Kao", "Morgan", "Norris", "Geyer", "Allen", "Chen", "Patel", "Nguyen", "Garcia", "Reed", "Okafor", "Bauer", "Sato", "Klein", "Foster"];
const ROLES = ["CEO", "CFO", "COO", "Director", "President", "EVP", "10% Owner", "Chief Accounting Officer", "General Counsel"];

let _insiderTxns: InsiderTransaction[] | null = null;
export function getInsiderTransactions(): InsiderTransaction[] {
  if (_insiderTxns) return _insiderTxns;
  const out: InsiderTransaction[] = [];
  const companies = getCompanies();
  let idn = 0;
  companies.forEach((c) => {
    const rng = makeRng(hashStr(c.ticker + "insider"));
    const count = intRange(rng, 2, 6);
    for (let i = 0; i < count; i++) {
      const first = pick(rng, FIRST);
      const last = pick(rng, LAST);
      const name = `${last}, ${first}`;
      const type = rng() > 0.45 ? "buy" : "sell";
      const shares = intRange(rng, 500, 250_000);
      const price = c.price * range(rng, 0.9, 1.05);
      out.push({
        id: `itx-${idn++}`,
        insider: name,
        insiderSlug: slugify(`${last} ${first}`),
        role: pick(rng, ROLES),
        ticker: c.ticker,
        company: c.name,
        type,
        code: type === "buy" ? "P" : "S",
        shares,
        price: Number(price.toFixed(2)),
        value: Math.round(shares * price),
        filedAt: ago(intRange(rng, 30, 60 * 24 * 21)),
        ownedAfter: intRange(rng, 10_000, 5_000_000),
      });
    }
  });
  out.sort((a, b) => +new Date(b.filedAt) - +new Date(a.filedAt));
  _insiderTxns = out;
  return out;
}

export function getInsiders(): Insider[] {
  const txns = getInsiderTransactions();
  const map = new Map<string, Insider>();
  for (const t of txns) {
    let ins = map.get(t.insiderSlug);
    if (!ins) {
      ins = {
        slug: t.insiderSlug,
        name: t.insider,
        roles: [],
        companies: [],
        totalBought: 0,
        totalSold: 0,
        txns: [],
      };
      map.set(t.insiderSlug, ins);
    }
    if (!ins.roles.includes(t.role)) ins.roles.push(t.role);
    if (!ins.companies.includes(t.ticker)) ins.companies.push(t.ticker);
    if (t.type === "buy") ins.totalBought += t.value;
    else ins.totalSold += t.value;
    ins.txns.push(t);
  }
  return [...map.values()].sort((a, b) => b.totalBought + b.totalSold - (a.totalBought + a.totalSold));
}

export function getInsider(slug: string): Insider | undefined {
  return getInsiders().find((i) => i.slug === slug);
}

// ---- Politicians ----
const POLS = [
  { name: "Nancy Pelosi", party: "D", chamber: "House", state: "CA" },
  { name: "Tommy Tuberville", party: "R", chamber: "Senate", state: "AL" },
  { name: "Dan Crenshaw", party: "R", chamber: "House", state: "TX" },
  { name: "Ro Khanna", party: "D", chamber: "House", state: "CA" },
  { name: "Markwayne Mullin", party: "R", chamber: "Senate", state: "OK" },
  { name: "Marjorie Taylor Greene", party: "R", chamber: "House", state: "GA" },
  { name: "Josh Gottheimer", party: "D", chamber: "House", state: "NJ" },
  { name: "Sheldon Whitehouse", party: "D", chamber: "Senate", state: "RI" },
] as const;
const AMOUNTS = ["$1K–$15K", "$15K–$50K", "$50K–$100K", "$100K–$250K", "$250K–$500K", "$500K–$1M", "$1M–$5M"];

let _polTrades: PoliticianTrade[] | null = null;
export function getPoliticianTrades(): PoliticianTrade[] {
  if (_polTrades) return _polTrades;
  const out: PoliticianTrade[] = [];
  const companies = getCompanies();
  let idn = 0;
  POLS.forEach((p) => {
    const rng = makeRng(hashStr(p.name));
    const count = intRange(rng, 3, 8);
    for (let i = 0; i < count; i++) {
      const c = pick(rng, companies);
      const traded = intRange(rng, 60, 60 * 24 * 40);
      out.push({
        id: `pol-${idn++}`,
        politician: p.name,
        politicianSlug: slugify(p.name),
        party: p.party,
        chamber: p.chamber,
        state: p.state,
        ticker: c.ticker,
        company: c.name,
        type: rng() > 0.4 ? "buy" : "sell",
        amountRange: pick(rng, AMOUNTS),
        tradedAt: ago(traded + 60 * 24 * 20),
        disclosedAt: ago(traded),
      });
    }
  });
  out.sort((a, b) => +new Date(b.disclosedAt) - +new Date(a.disclosedAt));
  _polTrades = out;
  return out;
}

export function getPolitician(slug: string) {
  const trades = getPoliticianTrades().filter((t) => t.politicianSlug === slug);
  if (!trades.length) return undefined;
  return { ...trades[0], trades };
}

// ---- Institutions ----
const FIRMS = [
  "Wellington Management Group LLP",
  "Renaissance Technologies LLC",
  "Bridgewater Associates LP",
  "Citadel Advisors LLC",
  "Two Sigma Investments LP",
  "Segall Bryant & Hamill LLC",
  "Summitry LLC",
  "Serenity Investment Advisors",
  "Converium Capital Inc",
  "Tiger Global Management LLC",
];

const ACTIONS: Holding["action"][] = ["new", "add", "trim", "sold", "hold"];

function buildHoldings(rng: () => number, n: number): Holding[] {
  const companies = getCompanies();
  const picks = [...companies].sort(() => rng() - 0.5).slice(0, n);
  let totalValue = 0;
  const raw = picks.map((c) => {
    const shares = intRange(rng, 50_000, 12_000_000);
    const value = Math.round(shares * c.price);
    totalValue += value;
    return { c, shares, value };
  });
  return raw
    .map(({ c, shares, value }) => ({
      ticker: c.ticker,
      company: c.name,
      shares,
      value,
      weight: Number(((value / totalValue) * 100).toFixed(2)),
      changePct: Number(range(rng, -60, 120).toFixed(1)),
      action: pick(rng, ACTIONS),
    }))
    .sort((a, b) => b.value - a.value);
}

let _institutions: Institution[] | null = null;
export function getInstitutions(): Institution[] {
  if (_institutions) return _institutions;
  _institutions = FIRMS.map((name) => {
    const rng = makeRng(hashStr(name));
    const holdings = buildHoldings(rng, intRange(rng, 6, 12));
    return {
      slug: slugify(name),
      name,
      aum: Math.round(range(rng, 2e9, 5e11)),
      holdingsCount: intRange(rng, 80, 1400),
      lastFiled: ago(intRange(rng, 60 * 24, 60 * 24 * 45)),
      topHoldings: holdings,
    };
  }).sort((a, b) => b.aum - a.aum);
  return _institutions;
}

export function getInstitution(slug: string): Institution | undefined {
  return getInstitutions().find((i) => i.slug === slug);
}

// ---- ETFs ----
const ETF_SEEDS = [
  { ticker: "SPY", name: "SPDR S&P 500 ETF Trust", issuer: "State Street", category: "Large Blend" },
  { ticker: "QQQ", name: "Invesco QQQ Trust", issuer: "Invesco", category: "Large Growth" },
  { ticker: "VTI", name: "Vanguard Total Stock Market ETF", issuer: "Vanguard", category: "Total Market" },
  { ticker: "IWM", name: "iShares Russell 2000 ETF", issuer: "BlackRock", category: "Small Blend" },
  { ticker: "ARKK", name: "ARK Innovation ETF", issuer: "ARK Invest", category: "Thematic" },
  { ticker: "XLF", name: "Financial Select Sector SPDR Fund", issuer: "State Street", category: "Financials" },
  { ticker: "SMH", name: "VanEck Semiconductor ETF", issuer: "VanEck", category: "Technology" },
  { ticker: "SCHD", name: "Schwab U.S. Dividend Equity ETF", issuer: "Schwab", category: "Large Value" },
];

let _etfs: ETF[] | null = null;
export function getETFs(): ETF[] {
  if (_etfs) return _etfs;
  _etfs = ETF_SEEDS.map((s) => {
    const rng = makeRng(hashStr(s.ticker + "etf"));
    return {
      ticker: s.ticker,
      exchange: "ARCX" as Exchange,
      name: s.name,
      issuer: s.issuer,
      category: s.category,
      aum: Math.round(range(rng, 2e9, 5e11)),
      expenseRatio: Number(range(rng, 0.03, 0.85).toFixed(2)),
      price: Number(range(rng, 40, 620).toFixed(2)),
      change: Number(range(rng, -3, 3).toFixed(2)),
      flow1m: Math.round(range(rng, -4e9, 9e9)),
      holdings: buildHoldings(rng, intRange(rng, 8, 14)),
    };
  });
  return _etfs;
}

export function getETF(ticker: string): ETF | undefined {
  return getETFs().find((e) => e.ticker.toLowerCase() === ticker.toLowerCase());
}

// ---- News ----
const SOURCES = ["Reuters", "Bloomberg", "CNBC", "WSJ", "MarketWatch", "Barron's", "The Information", "Seeking Alpha"];
const HEADLINE_TEMPLATES = [
  "{C} beats quarterly estimates as {S} demand accelerates",
  "Analysts raise {T} price target after upbeat guidance",
  "{C} announces $5B buyback and dividend increase",
  "Regulators open inquiry into {C}'s latest acquisition",
  "{C} unveils next-generation product line at investor day",
  "Insiders at {C} report cluster of open-market purchases",
  "{C} files shelf registration; analysts weigh dilution risk",
  "{S} sector rallies; {T} leads the move higher",
];
const SENT: NewsArticle["sentiment"][] = ["positive", "neutral", "negative"];

let _news: NewsArticle[] | null = null;
export function getNews(): NewsArticle[] {
  if (_news) return _news;
  const out: NewsArticle[] = [];
  const companies = getCompanies();
  companies.forEach((c, i) => {
    const rng = makeRng(hashStr(c.ticker + "news"));
    const count = intRange(rng, 1, 4);
    for (let k = 0; k < count; k++) {
      const tpl = pick(rng, HEADLINE_TEMPLATES);
      const headline = tpl
        .replace("{C}", c.name.replace(/,? (Inc\.|Corporation|Company|Co\.|LLC|Group).*/, ""))
        .replace("{T}", c.ticker)
        .replace(/\{S\}/g, c.sector);
      out.push({
        id: `news-${i}-${k}`,
        headline,
        source: pick(rng, SOURCES),
        url: "#",
        publishedAt: ago(intRange(rng, 10, 60 * 24 * 7)),
        tickers: [c.ticker],
        sentiment: pick(rng, SENT),
        summary: `${headline}. Coverage notes implications for the ${c.sector} sector and ${c.ticker} shareholders.`,
      });
    }
  });
  out.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  _news = out;
  return out;
}

// ---- Signals (derived) ----
export function getSignals(): Signal[] {
  const out: Signal[] = [];
  const txns = getInsiderTransactions().slice(0, 14);
  for (const t of txns) {
    out.push({
      id: `sig-i-${t.id}`,
      kind: t.type === "buy" ? "insider-buy" : "insider-sell",
      ticker: t.ticker,
      company: t.company,
      headline: `${t.role} ${t.type === "buy" ? "bought" : "sold"} ${t.ticker}`,
      detail: `${t.insider} ${t.type === "buy" ? "purchased" : "sold"} ${t.shares.toLocaleString()} shares ($${(t.value / 1e6).toFixed(1)}M)`,
      at: t.filedAt,
      strength: t.value > 5e6 ? "high" : t.value > 1e6 ? "medium" : "low",
    });
  }
  for (const p of getPoliticianTrades().slice(0, 8)) {
    out.push({
      id: `sig-p-${p.id}`,
      kind: "politician-buy",
      ticker: p.ticker,
      company: p.company,
      headline: `${p.politician} (${p.party}-${p.state}) ${p.type === "buy" ? "bought" : "sold"} ${p.ticker}`,
      detail: `Disclosed ${p.amountRange} ${p.type}`,
      at: p.disclosedAt,
      strength: "medium",
    });
  }
  for (const f of getFilings().filter((f) => f.tags.includes("dilution")).slice(0, 6)) {
    out.push({
      id: `sig-f-${f.id}`,
      kind: "dilution",
      ticker: f.ticker,
      company: f.company,
      headline: `Potential dilution flagged in ${f.ticker} ${f.type}`,
      detail: f.summary.slice(0, 90) + "…",
      at: f.filedAt,
      strength: "high",
    });
  }
  return out.sort((a, b) => +new Date(b.at) - +new Date(a.at));
}

export function getMovers() {
  const companies = getCompanies();
  const sorted = [...companies].sort((a, b) => b.change - a.change);
  return {
    gainers: sorted.slice(0, 5),
    losers: sorted.slice(-5).reverse(),
    active: [...companies].sort((a, b) => b.volume - a.volume).slice(0, 5),
  };
}
