/**
 * Real SEC EDGAR provider (no account required — only a descriptive User-Agent).
 *
 * SEC asks that automated traffic identify itself via User-Agent and stay under ~10 req/s.
 * Set SEC_USER_AGENT (e.g. "Trad3wise you@example.com"). Responses are cached with the
 * Next.js fetch cache (revalidate) so we don't hammer EDGAR on every request.
 */
import type { Filing, FilingType, InsiderTransaction, TxnCode, Holding } from "@/lib/types";
import { slugify } from "@/lib/utils";

const UA = process.env.SEC_USER_AGENT || "Trad3wise contact@trad3wise.app";
const CURRENT_FEED =
  "https://www.sec.gov/cgi-bin/browse-edgar?action=getcurrent&type=&company=&dateb=&owner=include&count=100&output=atom";

const KNOWN_FORMS: FilingType[] = [
  "10-K", "10-Q", "8-K", "S-1", "4", "3", "5", "13F-HR", "SC 13D", "SC 13G", "DEF 14A", "424B5",
];

const TAG_HINTS: { tag: string; forms: string[] }[] = [
  { tag: "dilution", forms: ["S-1", "424B5"] },
  { tag: "financing", forms: ["424B5", "S-1"] },
  { tag: "insider", forms: ["4", "3", "5"] },
  { tag: "13F", forms: ["13F-HR"] },
  { tag: "activist", forms: ["SC 13D"] },
  { tag: "proxy", forms: ["DEF 14A"] },
];

const FORM_SYNOPSIS: Record<string, string> = {
  "10-K": "Annual report (10-K) filed with the SEC.",
  "10-Q": "Quarterly report (10-Q) filed with the SEC.",
  "8-K": "Current report (8-K) disclosing a material event.",
  "S-1": "Registration statement (S-1) for a securities offering.",
  "4": "Insider transaction report (Form 4) of a change in beneficial ownership.",
  "3": "Initial statement of beneficial ownership (Form 3).",
  "5": "Annual statement of changes in beneficial ownership (Form 5).",
  "13F-HR": "Quarterly institutional holdings report (13F-HR).",
  "SC 13D": "Beneficial ownership report (SC 13D) — active stake over 5%.",
  "SC 13G": "Beneficial ownership report (SC 13G) — passive stake over 5%.",
  "DEF 14A": "Definitive proxy statement (DEF 14A).",
  "424B5": "Prospectus supplement (424B5) for a shelf takedown.",
};

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function normalizeForm(raw: string): FilingType {
  const f = raw.trim().toUpperCase();
  const exact = KNOWN_FORMS.find((k) => k.toUpperCase() === f);
  if (exact) return exact;
  // Map close variants (e.g. "4/A" -> "4", "10-K/A" -> "10-K").
  const base = f.replace(/\/A$/, "");
  const close = KNOWN_FORMS.find((k) => k.toUpperCase() === base);
  return (close || raw) as FilingType;
}

function tagsFor(form: string): string[] {
  return TAG_HINTS.filter((t) => t.forms.includes(form)).map((t) => t.tag);
}

/** Parse the EDGAR "get current" Atom feed into our Filing shape. */
function parseAtom(xml: string, limit: number): Filing[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const out: Filing[] = [];

  for (const e of entries.slice(0, limit)) {
    const title = decode((e.match(/<title>([\s\S]*?)<\/title>/) ?? [])[1] ?? "").trim();
    const href = (e.match(/<link[^>]*href="([^"]+)"/) ?? [])[1] ?? "";
    const term = (e.match(/<category[^>]*term="([^"]+)"/) ?? [])[1] ?? "";
    const updated = (e.match(/<updated>([\s\S]*?)<\/updated>/) ?? [])[1] ?? "";
    const idTag = (e.match(/accession-number=([0-9-]+)/) ?? [])[1] ?? "";
    const summaryRaw = decode((e.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) ?? [])[1] ?? "");
    const filedMatch = summaryRaw.match(/Filed:\s*([0-9-]+)/);

    // title looks like: "4 - Company Name (0001234567) (Issuer)"
    const dash = title.indexOf(" - ");
    const formStr = dash > -1 ? title.slice(0, dash) : term;
    let rest = dash > -1 ? title.slice(dash + 3) : title;
    const cikMatch = rest.match(/\((\d{4,10})\)/);
    const cik = cikMatch ? cikMatch[1] : undefined;
    const company = rest.replace(/\s*\(\d{4,10}\)\s*\([^)]*\)\s*$/, "").replace(/\s*\(\d{4,10}\)\s*$/, "").trim();

    const form = normalizeForm(formStr || term);
    const filedAt = filedMatch ? new Date(filedMatch[1] + "T00:00:00Z").toISOString() : (updated || new Date().toISOString());

    out.push({
      id: idTag || `edgar-${out.length}`,
      type: form,
      ticker: "",
      company: company || "Unknown filer",
      title,
      filedAt,
      summary: FORM_SYNOPSIS[form] ?? `${form} filed with the SEC.`,
      tags: tagsFor(form),
      url: href || "https://www.sec.gov/cgi-bin/browse-edgar",
      live: true,
      cik,
    });
  }
  return out;
}

/** Fetch the most recent filings across all companies from EDGAR. Throws on failure. */
export async function fetchLatestFilings(limit = 40): Promise<Filing[]> {
  const res = await fetch(CURRENT_FEED, {
    headers: { "User-Agent": UA, Accept: "application/atom+xml" },
    // Cache for 5 minutes to respect EDGAR and keep pages fast.
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`EDGAR ${res.status}`);
  const xml = await res.text();
  const filings = parseAtom(xml, limit);
  if (!filings.length) throw new Error("EDGAR: no entries parsed");
  return filings;
}

// ─── Ticker → CIK resolution ──────────────────────────────────────────────
async function fetchTickerMap(): Promise<Record<string, { cik: string; name: string }>> {
  const res = await fetch("https://www.sec.gov/files/company_tickers.json", {
    headers: { "User-Agent": UA },
    next: { revalidate: 86400 }, // 24h
  });
  if (!res.ok) throw new Error(`EDGAR tickers ${res.status}`);
  const json = (await res.json()) as Record<string, { cik_str: number; ticker: string; title: string }>;
  const map: Record<string, { cik: string; name: string }> = {};
  for (const k in json) {
    const e = json[k];
    map[e.ticker.toUpperCase()] = { cik: String(e.cik_str).padStart(10, "0"), name: e.title };
  }
  return map;
}

export async function resolveCik(ticker: string): Promise<{ cik: string; name: string } | null> {
  try {
    const map = await fetchTickerMap();
    return map[ticker.toUpperCase()] ?? null;
  } catch {
    return null;
  }
}

function accessionUrl(cik: string, accession: string): string {
  const cikInt = String(parseInt(cik, 10));
  const noDash = accession.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${cikInt}/${noDash}/${accession}-index.htm`;
}

/** Fetch a single company's recent filings from the EDGAR submissions API. Throws on failure. */
export async function fetchCompanyFilings(ticker: string, limit = 30): Promise<Filing[]> {
  const resolved = await resolveCik(ticker);
  if (!resolved) throw new Error(`No CIK for ${ticker}`);
  const res = await fetch(`https://data.sec.gov/submissions/CIK${resolved.cik}.json`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 3600 }, // 1h
  });
  if (!res.ok) throw new Error(`EDGAR submissions ${res.status}`);
  const json = await res.json();
  const r = json.filings?.recent;
  if (!r?.form?.length) throw new Error("EDGAR: no filings");

  const out: Filing[] = [];
  for (let i = 0; i < r.form.length && out.length < limit; i++) {
    const form = normalizeForm(r.form[i]);
    const accession = r.accessionNumber[i];
    out.push({
      id: accession,
      type: form,
      ticker: ticker.toUpperCase(),
      company: resolved.name,
      title: `${resolved.name} — ${r.form[i]}`,
      filedAt: new Date(r.filingDate[i] + "T00:00:00Z").toISOString(),
      summary: FORM_SYNOPSIS[form] ?? `${r.form[i]} filed with the SEC.`,
      tags: tagsFor(form),
      url: accessionUrl(resolved.cik, accession),
      live: true,
      cik: resolved.cik,
    });
  }
  return out;
}

// ─── Real financials from XBRL company facts ──────────────────────────────
export interface FinancialRow {
  year: string;
  revenue: number;
  grossProfit: number;
  netIncome: number;
  eps: number;
  fcf: number;
  assets: number;
  liabilities: number;
}

type Fact = { val: number; fy?: number; fp?: string; form?: string; frame?: string };

function annualByYear(facts: Record<string, { units: Record<string, Fact[]> }>, concepts: string[], unit = "USD"): Record<string, number> {
  for (const c of concepts) {
    const arr = facts[c]?.units?.[unit];
    if (!arr) continue;
    const byYear: Record<string, number> = {};
    for (const f of arr) {
      // Use clean annual XBRL "frames" (e.g. CY2024) from 10-K filings.
      if (f.frame && /^CY\d{4}$/.test(f.frame) && (f.form === "10-K" || f.form === "10-K/A")) {
        byYear[f.frame.slice(2)] = f.val;
      }
    }
    if (Object.keys(byYear).length) return byYear;
  }
  return {};
}

// ─── Real insider transactions (Form 4 XML) ──────────────────────────────
function rawDocUrl(cik: string, accession: string, primaryDocument: string): string {
  const cikInt = String(parseInt(cik, 10));
  const noDash = accession.replace(/-/g, "");
  const doc = primaryDocument.replace(/^xsl[^/]*\//, ""); // strip XSL-render prefix → raw XML
  return `https://www.sec.gov/Archives/edgar/data/${cikInt}/${noDash}/${doc}`;
}

function xmlVal(block: string, tag: string): string {
  const nested = block.match(new RegExp(`<${tag}>\\s*<value>([\\s\\S]*?)</value>`));
  if (nested) return nested[1].trim();
  const flat = block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  return flat ? flat[1].trim() : "";
}

function ownerRole(xml: string): string {
  const title = xmlVal(xml, "officerTitle");
  if (title) return title;
  if (/<isDirector>\s*(1|true)/i.test(xml)) return "Director";
  if (/<isTenPercentOwner>\s*(1|true)/i.test(xml)) return "10% Owner";
  return "Insider";
}

async function parseForm4(url: string, filedAt: string, idBase: string): Promise<InsiderTransaction[]> {
  const res = await fetch(url, { headers: { "User-Agent": UA }, next: { revalidate: 86400 } });
  if (!res.ok) return [];
  const xml = await res.text();

  const company = xmlVal(xml, "issuerName") || "Unknown";
  const ticker = (xmlVal(xml, "issuerTradingSymbol") || "").toUpperCase();
  const owner = xmlVal(xml, "rptOwnerName") || "Unknown";
  const role = ownerRole(xml);

  const blocks = xml.match(/<nonDerivativeTransaction>[\s\S]*?<\/nonDerivativeTransaction>/g) ?? [];
  const out: InsiderTransaction[] = [];
  blocks.forEach((b, i) => {
    const shares = Number(xmlVal(b, "transactionShares")) || 0;
    const price = Number(xmlVal(b, "transactionPricePerShare")) || 0;
    if (!shares) return;
    const ad = xmlVal(b, "transactionAcquiredDisposedCode").toUpperCase();
    const code = (xmlVal(b, "transactionCode") || "P").slice(0, 1) as TxnCode;
    out.push({
      id: `${idBase}-${i}`,
      insider: owner,
      insiderSlug: slugify(owner),
      role,
      ticker,
      company,
      type: ad === "A" ? "buy" : "sell",
      code,
      shares,
      price,
      value: Math.round(shares * price),
      filedAt,
      ownedAfter: Number(xmlVal(b, "sharesOwnedFollowingTransaction")) || 0,
    });
  });
  return out;
}

/** Fetch a company's recent insider (Form 4) transactions from EDGAR. Throws on failure. */
export async function fetchCompanyInsiderTransactions(ticker: string, limit = 12): Promise<InsiderTransaction[]> {
  const resolved = await resolveCik(ticker);
  if (!resolved) throw new Error(`No CIK for ${ticker}`);
  const res = await fetch(`https://data.sec.gov/submissions/CIK${resolved.cik}.json`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`EDGAR submissions ${res.status}`);
  const json = await res.json();
  const r = json.filings?.recent;
  if (!r?.form?.length) throw new Error("EDGAR: no filings");

  const jobs: { url: string; filedAt: string; idBase: string }[] = [];
  for (let i = 0; i < r.form.length && jobs.length < limit; i++) {
    if (r.form[i] !== "4") continue;
    jobs.push({
      url: rawDocUrl(resolved.cik, r.accessionNumber[i], r.primaryDocument[i]),
      filedAt: new Date(r.filingDate[i] + "T00:00:00Z").toISOString(),
      idBase: r.accessionNumber[i],
    });
  }
  if (!jobs.length) throw new Error("EDGAR: no Form 4 filings");

  const results = await Promise.all(jobs.map((j) => parseForm4(j.url, j.filedAt, j.idBase).catch(() => [])));
  const txns = results.flat();
  if (!txns.length) throw new Error("EDGAR: no parsable transactions");
  return txns.sort((a, b) => +new Date(b.filedAt) - +new Date(a.filedAt));
}

export async function fetchCompanyFinancials(ticker: string): Promise<FinancialRow[]> {
  const resolved = await resolveCik(ticker);
  if (!resolved) throw new Error(`No CIK for ${ticker}`);
  const res = await fetch(`https://data.sec.gov/api/xbrl/companyfacts/CIK${resolved.cik}.json`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`EDGAR facts ${res.status}`);
  const json = await res.json();
  const g = json.facts?.["us-gaap"] ?? {};

  const revenue = annualByYear(g, ["Revenues", "RevenueFromContractWithCustomerExcludingAssessedTax", "RevenueFromContractWithCustomerIncludingAssessedTax", "SalesRevenueNet"]);
  const gross = annualByYear(g, ["GrossProfit"]);
  const net = annualByYear(g, ["NetIncomeLoss", "ProfitLoss"]);
  const assets = annualByYear(g, ["Assets"]);
  const liabilities = annualByYear(g, ["Liabilities"]);
  const eps = annualByYear(g, ["EarningsPerShareDiluted", "EarningsPerShareBasic"], "USD/shares");
  const ocf = annualByYear(g, ["NetCashProvidedByUsedInOperatingActivities"]);
  const capex = annualByYear(g, ["PaymentsToAcquirePropertyPlantAndEquipment"]);

  const years = Object.keys(revenue).length ? Object.keys(revenue) : Object.keys(net);
  const sorted = years.sort().slice(-4);
  if (sorted.length < 2) throw new Error("EDGAR: insufficient financial history");

  return sorted.map((y) => ({
    year: y,
    revenue: revenue[y] ?? 0,
    grossProfit: gross[y] ?? 0,
    netIncome: net[y] ?? 0,
    eps: eps[y] ?? 0,
    fcf: ocf[y] != null ? ocf[y] - (capex[y] ?? 0) : 0,
    assets: assets[y] ?? 0,
    liabilities: liabilities[y] ?? 0,
  }));
}

// ─── Real 13F institutional holdings ──────────────────────────────────────
/** Resolve an institutional filer's CIK by name via EDGAR company search (type 13F-HR). */
export async function resolveFilerCik(name: string): Promise<string | null> {
  const url = `https://www.sec.gov/cgi-bin/browse-edgar?company=${encodeURIComponent(name)}&CIK=&type=13F-HR&action=getcompany&output=atom`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, next: { revalidate: 86400 } });
  if (!res.ok) return null;
  const xml = await res.text();
  const m = xml.match(/<cik>(\d+)<\/cik>/i);
  return m ? m[1].padStart(10, "0") : null;
}

export interface InstitutionHoldings {
  holdings: Holding[];
  totalValue: number;
  count: number;
  asOf: string;
}

/** Fetch a filer's most recent 13F-HR holdings (information table XML). Throws on failure. */
export async function fetchInstitutionHoldings(name: string, top = 25): Promise<InstitutionHoldings> {
  const cik = await resolveFilerCik(name);
  if (!cik) throw new Error(`No CIK for ${name}`);

  const subs = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 3600 },
  });
  if (!subs.ok) throw new Error(`EDGAR submissions ${subs.status}`);
  const json = await subs.json();
  const r = json.filings?.recent;
  let accession = "";
  let asOf = "";
  for (let i = 0; i < (r?.form?.length ?? 0); i++) {
    if (r.form[i] === "13F-HR") {
      accession = r.accessionNumber[i];
      asOf = r.reportDate?.[i] || r.filingDate[i];
      break;
    }
  }
  if (!accession) throw new Error("EDGAR: no 13F-HR filing");

  const cikInt = String(parseInt(cik, 10));
  const noDash = accession.replace(/-/g, "");
  const base = `https://www.sec.gov/Archives/edgar/data/${cikInt}/${noDash}`;

  // Find the information-table XML (any .xml other than the cover primary_doc.xml).
  const idx = await fetch(`${base}/index.json`, { headers: { "User-Agent": UA }, next: { revalidate: 86400 } });
  if (!idx.ok) throw new Error(`EDGAR index ${idx.status}`);
  const items: { name: string }[] = (await idx.json()).directory?.item ?? [];
  const candidates = items
    .map((i) => i.name)
    .filter((n) => n.endsWith(".xml") && n.toLowerCase() !== "primary_doc.xml");

  let xml = "";
  for (const c of candidates) {
    const r2 = await fetch(`${base}/${c}`, { headers: { "User-Agent": UA }, next: { revalidate: 86400 } });
    if (!r2.ok) continue;
    const t = await r2.text();
    if (/<(?:\w+:)?infoTable>/.test(t)) {
      xml = t;
      break;
    }
  }
  if (!xml) throw new Error("EDGAR: no information table");

  const tables = xml.match(/<(?:\w+:)?infoTable>[\s\S]*?<\/(?:\w+:)?infoTable>/g) ?? [];
  const get = (b: string, tag: string) => {
    const m = b.match(new RegExp(`<(?:\\w+:)?${tag}>([\\s\\S]*?)</(?:\\w+:)?${tag}>`));
    return m ? m[1].trim() : "";
  };

  // Aggregate by CUSIP (filers list the same issuer across share classes / managers).
  const agg = new Map<string, { company: string; shares: number; value: number }>();
  let totalValue = 0;
  for (const t of tables) {
    const cusip = get(t, "cusip");
    const company = get(t, "nameOfIssuer");
    const value = Number(get(t, "value")) || 0;
    const shares = Number(get(t, "sshPrnamt")) || 0;
    if (!cusip || !value) continue;
    totalValue += value;
    const prev = agg.get(cusip);
    if (prev) {
      prev.shares += shares;
      prev.value += value;
    } else {
      agg.set(cusip, { company, shares, value });
    }
  }
  if (!agg.size) throw new Error("EDGAR: empty information table");

  const holdings: Holding[] = [...agg.values()]
    .sort((a, b) => b.value - a.value)
    .slice(0, top)
    .map((h) => ({
      ticker: "",
      company: h.company,
      shares: h.shares,
      value: h.value,
      weight: Number(((h.value / totalValue) * 100).toFixed(2)),
      changePct: 0,
      action: "hold" as const,
    }));

  return { holdings, totalValue, count: agg.size, asOf };
}
