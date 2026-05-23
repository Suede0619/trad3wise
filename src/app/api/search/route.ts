import { NextResponse } from "next/server";
import { listCompanies, listInsiders, listInstitutions, listETFs } from "@/lib/data";

export type SearchResult = {
  type: "company" | "insider" | "institution" | "etf";
  label: string;
  sub: string;
  href: string;
};

export function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get("q") || "").toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const c of listCompanies()) {
    if (!q || c.ticker.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)) {
      results.push({
        type: "company",
        label: `${c.ticker} · ${c.name}`,
        sub: `${c.exchange} · ${c.sector}`,
        href: `/companies/${c.exchange}:${c.ticker}`,
      });
    }
  }
  for (const e of listETFs()) {
    if (!q || e.ticker.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)) {
      results.push({ type: "etf", label: `${e.ticker} · ${e.name}`, sub: e.issuer, href: `/etfs/${e.exchange}:${e.ticker}` });
    }
  }
  for (const i of listInstitutions()) {
    if (!q || i.name.toLowerCase().includes(q)) {
      results.push({ type: "institution", label: i.name, sub: "13F filer", href: `/institutions/${i.slug}` });
    }
  }
  for (const p of listInsiders()) {
    if (q && p.name.toLowerCase().includes(q)) {
      results.push({ type: "insider", label: p.name, sub: p.roles.join(", "), href: `/insiders/${p.slug}` });
    }
  }

  return NextResponse.json({ results: results.slice(0, 30) });
}
