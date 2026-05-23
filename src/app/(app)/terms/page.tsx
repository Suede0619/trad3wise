import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Terms of Service" };

const SECTIONS: { h: string; p: string }[] = [
  { h: "1. Acceptance of terms", p: "By accessing or using Trad3wise (the “Service”), you agree to these Terms. If you do not agree, do not use the Service." },
  { h: "2. The Service", p: "Trad3wise aggregates publicly available SEC filings and market data and presents derived analytics, AI-generated summaries, screeners, alerts, and an API. Availability and features may change at any time." },
  { h: "3. Not investment advice", p: "All data, analytics, AI output, reports, and alerts are provided for informational and research purposes only. They are not investment, financial, legal, or tax advice and must not be relied upon as the basis for any decision. You are solely responsible for your decisions." },
  { h: "4. Data accuracy", p: "Source data may contain errors, delays, or omissions. We make no warranty as to accuracy, completeness, or timeliness, and disclaim liability for reliance on the Service." },
  { h: "5. Accounts & access", p: "You are responsible for safeguarding your credentials and API keys and for all activity under your account. Access may be gated by access code, invitation, or subscription tier." },
  { h: "6. Subscriptions & billing", p: "Paid plans renew automatically until cancelled. We will give existing subscribers at least 30 days’ notice of any price change by email or in-app notification. Fees are non-refundable except where required by law." },
  { h: "7. Acceptable use", p: "You may not scrape beyond rate limits, resell data without authorization, reverse engineer the Service, or use it to violate any law or third-party right." },
  { h: "8. Limitation of liability", p: "To the maximum extent permitted by law, Trad3wise is not liable for any indirect, incidental, or consequential damages, or for trading losses, arising from use of the Service." },
  { h: "9. Changes", p: "We may update these Terms from time to time. Continued use after changes constitutes acceptance." },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Terms of Service" description="Last updated May 23, 2026" />
      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <section key={s.h}>
            <h2 className="text-sm font-semibold">{s.h}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
