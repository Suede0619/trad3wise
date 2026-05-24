import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CompanyScreener } from "@/components/screeners/company-screener";
import { Badge } from "@/components/ui/badge";
import { getCompaniesWithQuotes } from "@/lib/data";
import { SECTORS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Companies",
  description: "Screen public companies by sector, market cap, price action, and SEC-filing signals.",
};

export const revalidate = 60;

export default async function CompaniesPage() {
  const { companies, source } = await getCompaniesWithQuotes();
  return (
    <div>
      <PageHeader
        title="Company screener"
        description="Filter, sort, and screen public companies by sector, market cap, price action, and filing-driven signals."
      >
        {source === "live" ? (
          <Badge variant="up"><span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-up" /> Live quotes</Badge>
        ) : (
          <Badge variant="warn">Sample prices</Badge>
        )}
      </PageHeader>
      <CompanyScreener companies={companies} sectors={SECTORS} />
    </div>
  );
}
