export type ProductReportResponse = {
  id: number;
  productId: number;
  profit: number;
  revenue: number;
  stock: number;
  productName: string;
};

export type BranchReportResponse = {
  id: number;
  branchId: number;
  profit: number;
  revenue: number;
  branchName: string;
};

export type MonthlyReportResponse = {
  id: number;
  date: string;
  profit: number;
  revenue: number;
  stock: number;
};

export type CurrentMonthReportResponse = {
  damage: number;
  revenue: number | null;
  profit: number | null;
};
