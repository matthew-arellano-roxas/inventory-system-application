import { BranchReport } from '@root/generated/prisma/client';

export type OPEXData = {
  netProfit: number;
  remainingRequiredProfit: number;
  operationExpenses: number;
};
export type BranchReportOutput = Omit<BranchReport, 'id'>;
export type BranchFinancialReport = BranchReportOutput &
  OPEXData & {
    branchName: string;
  };
