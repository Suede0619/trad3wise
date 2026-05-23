import type { Metadata } from "next";
import Link from "next/link";
import { PLANS } from "@/lib/config";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple plans — Free, Starter, Professional, and Enterprise.",
};

export default function PricingPage() {
  return (
    <div>
      <PageHeader title="Pricing" description="Start free. Upgrade when you need real-time signals, AI, and API access." />

      <div className="grid gap-4 lg:grid-cols-4">
        {PLANS.map((p) => (
          <Card key={p.id} className={cn("flex flex-col", p.highlighted && "border-primary glow")}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold">{p.name}</span>
                {p.highlighted && <Badge variant="primary">Popular</Badge>}
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">{p.price}</span>
                <span className="text-xs text-muted-foreground">/{p.period}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.tagline}</p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <ul className="flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-5 w-full" variant={p.highlighted ? "default" : "outline"}>
                <Link href={p.id === "enterprise" ? "/account" : "/account"}>{p.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Prices are placeholders. Connect Stripe (docs/SETUP.md) for live checkout. We give existing
        subscribers at least 30 days&apos; notice of any price change.
      </p>
    </div>
  );
}
