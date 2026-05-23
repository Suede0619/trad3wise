import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { InsiderFeed } from "@/components/data/insider-feed";
import { listInsiderTransactions } from "@/lib/data";

export const metadata: Metadata = {
  title: "Insiders",
  description: "Live Form 3/4/5 insider transactions — buys, sells, roles, and values.",
};

export default function InsidersPage() {
  return (
    <div>
      <PageHeader
        title="Insider transactions"
        description="Form 3/4/5 activity across the market. Filter by side, value, and role to spot insider conviction."
      />
      <InsiderFeed txns={listInsiderTransactions()} />
    </div>
  );
}
