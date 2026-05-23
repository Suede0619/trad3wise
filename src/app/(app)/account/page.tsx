import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stat } from "@/components/ui/stat";
import { CreditCard, Gift } from "lucide-react";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div>
      <PageHeader title="Account" description="Your plan, billing, and usage." />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Current plan" value={<span className="text-primary">Professional</span>} />
        <Stat label="Renews" value="Jun 23, 2026" />
        <Stat label="Watchlists" value="3" />
        <Stat label="Alerts" value="12" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Billing</CardTitle>
            <Badge variant="up">active</Badge>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span>Professional · $99/mo</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span>•••• 4242</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Next invoice</span><span>$99.00 on Jun 23</span></div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline" asChild><Link href="/pricing">Change plan</Link></Button>
              <Button size="sm" variant="ghost">Manage billing</Button>
            </div>
            <p className="text-[11px] text-muted-foreground">Connect Stripe (docs/SETUP.md) to enable real checkout & the billing portal.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Gift className="h-4 w-4" /> Referrals</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">Give a month, get a month. Share your link to earn account credit.</p>
            <code className="block rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs">https://trad3wise.app/r/USER123</code>
            <Button size="sm" variant="outline" asChild><Link href="/referrals">Open referral dashboard</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
