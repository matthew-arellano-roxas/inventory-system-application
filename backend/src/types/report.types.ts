import { BranchReport } from '@root/generated/prisma/client';

export type OPEXData = {
  netProfit: number;
  operationExpenses: number;
};
export type BranchReportOutput = Omit<BranchReport, 'id'>;
export type BranchFinancialReport = BranchReportOutput &
  OPEXData & {
    branchName: string;
  };

export type ProductReportQuery = {
  product_details?: boolean;
  search?: string;
  page?: number;
  productId?: number;
  branchId?: number;
};

export type ProductReportSummary = {
  totalStock: number;
  lowStockCount: number;
  topRevenueReports: unknown[];
  lowStockReports: unknown[];
};
