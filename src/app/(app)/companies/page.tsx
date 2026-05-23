import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { CompanyScreener } from "@/components/screeners/company-screener";
import { listCompanies } from "@/lib/data";
import { SECTORS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Companies",
  description: "Screen public companies by sector, market cap, price action, and SEC-filing signals.",
};

export default function CompaniesPage() {
  return (
    <div>
      <PageHeader
        title="Company screener"
        description="Filter, sort, and screen public companies by sector, market cap, price action, and filing-driven signals."
      />
      <CompanyScreener companies={listCompanies()} sectors={SECTORS} />
    </div>
  );
}
