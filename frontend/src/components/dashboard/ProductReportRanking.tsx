"use client";

import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import type { ProductReportResponse } from "@/types/api/response/report.response";

function formatCurrency(n: number) {
  return n.toLocaleString("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  });
}

export function ProductReportRanking({
  data,
}: {
  data: ProductReportResponse[];
}) {
  const ranked = useMemo(() => {
    return [...data]
      .map((p) => ({
        ...p,
        margin: p.revenue ? (p.profit / p.revenue) * 100 : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
        <CardDescription>Ranked by revenue</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-muted-foreground">
            <tr className="border-b">
              <th className="text-left py-2">#</th>
              <th className="text-left py-2">Product</th>
              <th className="text-right py-2">Revenue</th>
              <th className="text-right py-2">Profit</th>
              <th className="text-right py-2">Stock</th>
              <th className="text-right py-2">Margin</th>
            </tr>
          </thead>

          <tbody>
            {ranked.map((p, index) => {
              const margin = p.margin;

              const marginColor =
                margin >= 25
                  ? "text-emerald-600 dark:text-emerald-400"
                  : margin >= 15
                    ? "text-yellow-600 dark:text-yellow-400"
                    : "text-rose-600 dark:text-rose-400";

              return (
                <tr
                  key={p.id}
                  className={`border-b last:border-0 transition-colors ${
                    index === 0
                      ? "bg-emerald-500/10 hover:bg-emerald-500/15"
                      : index === 1
                        ? "bg-indigo-500/10 hover:bg-indigo-500/15"
                        : index === 2
                          ? "bg-amber-500/10 hover:bg-amber-500/15"
                          : "bg-transparent hover:bg-muted/40"
                  }`}
                >
                  <td className="py-2 font-semibold text-muted-foreground">
                    {index + 1}
                  </td>

                  <td className="py-2 font-medium text-foreground">
                    {p.productName}
                  </td>

                  <td className="py-2 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(p.revenue)}
                  </td>

                  <td className="py-2 text-right font-medium text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(p.profit)}
                  </td>

                  <td
                    className={`py-2 text-right font-medium ${
                      p.stock < 30
                        ? "text-rose-600 dark:text-rose-400"
                        : p.stock < 60
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {p.stock}
                  </td>

                  <td
                    className={`py-2 text-right font-semibold ${marginColor}`}
                  >
                    {margin.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
