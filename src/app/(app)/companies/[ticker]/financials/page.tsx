import { notFound } from "next/navigation";
import { getCompany, getCompanyFinancials } from "@/lib/data";
import { parseTicker, fmtMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const revalidate = 86400;

export default async function FinancialsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { exchange, ticker } = parseTicker(raw);
  const company = getCompany(exchange, ticker) ?? getCompany("NASDAQ", ticker) ?? getCompany("NYSE", ticker);
  if (!company) notFound();

  const { rows: fin, source } = await getCompanyFinancials(company.ticker);
  const rows: { label: string; key: keyof (typeof fin)[number]; money?: boolean }[] = [
    { label: "Revenue", key: "revenue", money: true },
    { label: "Gross profit", key: "grossProfit", money: true },
    { label: "Net income", key: "netIncome", money: true },
    { label: "EPS (diluted)", key: "eps" },
    { label: "Free cash flow", key: "fcf", money: true },
    { label: "Total assets", key: "assets", money: true },
    { label: "Total liabilities", key: "liabilities", money: true },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between">
        <div>
          <CardTitle>Annual financials</CardTitle>
          <p className="text-xs text-muted-foreground">
            {source === "edgar"
              ? "Reported figures from SEC XBRL company facts (10-K, fiscal years)."
              : "Illustrative figures. Live XBRL facts were unavailable for this issuer."}
          </p>
        </div>
        {source === "edgar" ? (
          <Badge variant="up"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-up" /> SEC XBRL</Badge>
        ) : (
          <Badge variant="warn">Sample</Badge>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <tr>
              <th className="text-left">Metric</th>
              {fin.map((f) => <th key={f.year} className="text-right">{f.year}</th>)}
            </tr>
          </THead>
          <TBody>
            {rows.map((r) => (
              <TR key={r.label}>
                <td className="font-medium">{r.label}</td>
                {fin.map((f) => {
                  const v = f[r.key] as number;
                  return (
                    <td key={f.year} className="text-right tnum">
                      {v === 0 ? "—" : r.money ? fmtMoney(v, { compact: true }) : v.toFixed(2)}
                    </td>
                  );
                })}
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
