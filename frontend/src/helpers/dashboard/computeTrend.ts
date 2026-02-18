import { percentageChange } from "@/helpers/dashboard/percentageChange";
import type { BranchRow } from "@/types/dashboard.types";

export type TrendKey = "revenue" | "profit";
export type TrendDirection = "up" | "down";

export type TrendResult =
  | { direction: TrendDirection; percentText: string }
  | null;

export function computeMonthlyTrend<
  T extends Record<TrendKey, number>
>(data: readonly T[], trendKey: TrendKey): TrendResult {
  if (data.length < 2) return null;

  const last = data[data.length - 1][trendKey];
  const prev = data[data.length - 2][trendKey];

  const change = percentageChange(last, prev);

  if (change === null) {
    return { direction: last >= prev ? "up" : "down", percentText: "—" };
  }

  return {
    direction: change >= 0 ? "up" : "down",
    percentText: `${Math.abs(change).toFixed(1)}%`,
  };
}

export function computeBranchTrend(data: BranchRow[], key: "revenue" | "profit") {
  if (data.length < 2) return null;

  const sorted = [...data].sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
  const top = sorted[0][key] ?? 0;
  const second = sorted[1][key] ?? 0;

  if (second === 0) return null;

  const diff = top - second;
  const pct = (diff / second) * 100;

  return {
    direction: diff >= 0 ? ("up" as const) : ("down" as const),
    percentText: `${Math.abs(pct).toFixed(1)}%`,
    topName: sorted[0].branchName,
    secondName: sorted[1].branchName,
  };
}