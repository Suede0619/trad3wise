import Link from "next/link";
import { SITE } from "@/lib/config";

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-6 text-xs text-muted-foreground">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl leading-relaxed">
          {SITE.name} aggregates public SEC filings and market data. All data, summaries, AI output,
          reports, and alerts are <strong className="text-foreground">for informational and research
          purposes only</strong> and are not investment, financial, legal, or tax advice.
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
          <Link href="/docs" className="hover:text-foreground">API Docs</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
        </nav>
      </div>
      <div className="mt-3 text-[11px]">
        © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}
      </div>
    </footer>
  );
}
