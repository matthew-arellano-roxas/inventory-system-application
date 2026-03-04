import { BranchFinancialReport } from '@/types/report.types';
import { opexService } from './opex.service';
import { getBranchReportByBranchId, getBranchReports } from './report-read.service';

const getNetProfit = (profit: number, totalExpenses: number) => profit - totalExpenses;

export const getFinancialReportByBranchId = async (branchId: number) => {
  const reports = await getBranchReportByBranchId(branchId);
  const totalExpenses = await opexService.getTotalOpex(branchId);
  const profit = reports?.profit ?? 0;
  const netProfit = getNetProfit(profit, totalExpenses);

  const financialReport: BranchFinancialReport = {
    ...reports,
    netProfit,
    operationExpenses: totalExpenses,
  };

  return financialReport;
};

export const getFinancialReportList = async () => {
  const reports = await getBranchReports();
  const financialReportList: BranchFinancialReport[] = [];

  for (const report of reports) {
    const totalExpenses = await opexService.getTotalOpex(report.branchId);
    const profit = report.profit ?? 0;
    const netProfit = getNetProfit(profit, totalExpenses);

    financialReportList.push({
      ...report,
      netProfit,
      operationExpenses: totalExpenses,
    });
  }

  return financialReportList;
};
