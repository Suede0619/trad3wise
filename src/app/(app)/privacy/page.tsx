import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";

export const metadata: Metadata = { title: "Privacy Policy" };

const SECTIONS: { h: string; p: string }[] = [
  { h: "1. Information we collect", p: "Account details (name, email), usage data (pages viewed, queries, alerts), device and cookie data, and—if you connect a brokerage—read-only holdings via our integration provider." },
  { h: "2. How we use it", p: "To operate and improve the Service, deliver alerts and digests, personalize signals, process payments, and meet legal obligations." },
  { h: "3. Cookies", p: "We use essential cookies to keep you signed in and remember preferences, and analytics cookies to measure usage. You can choose “essential only” in the consent banner." },
  { h: "4. AI processing", p: "Your prompts to the AI agent and the filing context are sent to our model provider to generate responses. We do not sell your prompts." },
  { h: "5. Sharing", p: "We share data with infrastructure, payment, email, and analytics processors under contract. We do not sell personal information." },
  { h: "6. Brokerage data", p: "Brokerage connections are read-only. We never place trades or move funds, and access can be revoked at any time." },
  { h: "7. Security", p: "We use encryption in transit, hashed API keys, and least-privilege access. No system is perfectly secure." },
  { h: "8. Your rights", p: "You may access, export, or delete your data from Settings, or by contacting us. Rights vary by jurisdiction (e.g. GDPR/CCPA)." },
  { h: "9. Contact", p: "Questions about privacy? Reach us at privacy@trad3wise.app." },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Privacy Policy" description="Last updated May 23, 2026" />
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
