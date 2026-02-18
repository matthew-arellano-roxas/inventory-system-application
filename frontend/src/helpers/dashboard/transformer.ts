import type { BranchReportResponse, MonthlyReportResponse } from "@/types/api/response/report.response";
import type { BranchRow, MonthRow } from "@/types/dashboard.types";
import { getMonth } from "@/helpers/getMonth";

export function getMonthRow(report: MonthlyReportResponse[]): MonthRow[] {
  return report.map((report) => {
    const date = new Date(report.date);
    return {
      month: getMonth(date),
      revenue: report.revenue,
      profit: report.profit,
    };
  });
}


export function getBranchRow(list: BranchReportResponse[]): BranchRow[] {
  return list.map((b) => ({
    branchName: b.branchName,
    revenue: b.revenue,
    profit: b.profit,
  }));
}
