import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Button } from "@/components/ui/button";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";

export const metadata: Metadata = { title: "Referrals" };

const REFERRALS = [
  { email: "a***@gmail.com", status: "subscribed", reward: "$99 credit", date: "May 12" },
  { email: "j***@outlook.com", status: "trial", reward: "pending", date: "May 18" },
  { email: "m***@proton.me", status: "signed up", reward: "pending", date: "May 21" },
];

export default function ReferralsPage() {
  return (
    <div>
      <PageHeader title="Referrals" description="Give a month, get a month. Earn account credit for every friend who subscribes." />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Referrals" value="3" />
        <Stat label="Subscribed" value={<span className="text-up">1</span>} />
        <Stat label="Credit earned" value="$99" />
        <Stat label="Pending" value="2" />
      </div>

      <Card className="mb-5">
        <CardHeader><CardTitle>Your referral link</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-2 sm:flex-row">
          <code className="flex-1 rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs">https://trad3wise.app/r/USER123</code>
          <Button size="sm"><Copy className="h-4 w-4" /> Copy link</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Activity</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <THead>
              <tr>
                <th className="text-left">Referral</th>
                <th className="text-left">Status</th>
                <th className="text-left">Reward</th>
                <th className="text-right">Date</th>
              </tr>
            </THead>
            <TBody>
              {REFERRALS.map((r) => (
                <TR key={r.email}>
                  <td className="font-mono text-xs">{r.email}</td>
                  <td><Badge variant={r.status === "subscribed" ? "up" : "outline"}>{r.status}</Badge></td>
                  <td className="text-muted-foreground">{r.reward}</td>
                  <td className="text-right text-[11px] text-muted-foreground">{r.date}</td>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
