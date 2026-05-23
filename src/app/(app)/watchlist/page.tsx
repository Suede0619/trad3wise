import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { WatchlistView } from "@/components/data/watchlist-view";
import { listCompanies } from "@/lib/data";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "Your saved companies and entities.",
};

export default function WatchlistPage() {
  return (
    <div>
      <PageHeader title="Watchlist" description="Companies you're tracking. Add or remove from any company page." />
      <WatchlistView companies={listCompanies()} />
    </div>
  );
}
