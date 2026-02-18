import type { MonthlyReportResponse } from "@/types/api/response";

export const MOCK_MONTHLY_REPORT: MonthlyReportResponse[] = [
  {
    id: 1,
    date: "2026-02-01T00:00:00.000Z",
    profit: 12000,
    revenue: 40000,
    stock: 300,
  },
  {
    id: 2,
    date: "2026-03-01T00:00:00.000Z",
    profit: 15000,
    revenue: 47000,
    stock: 280,
  },
  {
    id: 3,
    date: "2026-04-01T00:00:00.000Z",
    profit: 11000,
    revenue: 42000,
    stock: 310,
  },
  {
    id: 4,
    date: "2026-05-01T00:00:00.000Z",
    profit: 17000,
    revenue: 52000,
    stock: 260,
  },
];
