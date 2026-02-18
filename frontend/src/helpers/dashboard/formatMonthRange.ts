import type { MonthRow } from "@/types/dashboard.types";

export function formatMonthRange(data: MonthRow[], year?: number) {
  if (!data.length) return "—";
  const first = data[0]?.month;
  const last = data[data.length - 1]?.month;
  if (!first || !last) return "—";
  const range = `${first} – ${last}`;
  return year ? `${range} ${year}` : range;
}
