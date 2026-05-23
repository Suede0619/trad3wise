import type { MetadataRoute } from "next";
import { listCompanies, listETFs, listInstitutions, listInsiders } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://trad3wise.vercel.app";
  const now = new Date();

  const staticPaths = [
    "",
    "/companies",
    "/insiders",
    "/politicians",
    "/institutions",
    "/etfs",
    "/sec-filings",
    "/news",
    "/docs",
    "/pricing",
    "/terms",
    "/privacy",
  ].map((p) => ({ url: `${base}${p}`, lastModified: now }));

  const companies = listCompanies().map((c) => ({ url: `${base}/companies/${c.exchange}:${c.ticker}`, lastModified: now }));
  const etfs = listETFs().map((e) => ({ url: `${base}/etfs/${e.exchange}:${e.ticker}`, lastModified: now }));
  const institutions = listInstitutions().map((i) => ({ url: `${base}/institutions/${i.slug}`, lastModified: now }));
  const insiders = listInsiders().slice(0, 200).map((i) => ({ url: `${base}/insiders/${i.slug}`, lastModified: now }));

  return [...staticPaths, ...companies, ...etfs, ...institutions, ...insiders];
}
