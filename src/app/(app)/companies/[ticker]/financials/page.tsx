import { notFound } from "next/navigation";
import { getCompany, getFinancials } from "@/lib/data";
import { parseTicker, fmtMoney } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR } from "@/components/ui/table";

export default async function FinancialsPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker: raw } = await params;
  const { exchange, ticker } = parseTicker(raw);
  const company = getCompany(exchange, ticker) ?? getCompany("NASDAQ", ticker) ?? getCompany("NYSE", ticker);
  if (!company) notFound();

  const fin = getFinancials(company.ticker);
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
      <CardHeader>
        <CardTitle>Annual financials</CardTitle>
        <p className="text-xs text-muted-foreground">
          Illustrative figures. Connect a market-data provider (see docs/SETUP.md) for reported financials from SEC filings.
        </p>
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
                {fin.map((f) => (
                  <td key={f.year} className="text-right tnum">
                    {r.money ? fmtMoney(f[r.key] as number, { compact: true }) : (f[r.key] as number).toFixed(2)}
                  </td>
                ))}
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
