import type { BranchReportResponse } from "@/types/api/response";

export const MOCK_BRANCH_REPORT: BranchReportResponse[] = [
  {
    id: 1,
    branchId: 101,
    profit: 25000,
    revenue: 120000,
    branchName: "Manila Branch",
  },
  {
    id: 2,
    branchId: 102,
    profit: 18000,
    revenue: 95000,
    branchName: "Cebu Branch",
  },
  {
    id: 3,
    branchId: 103,
    profit: 32000,
    revenue: 150000,
    branchName: "Davao Branch",
  },
  {
    id: 4,
    branchId: 104,
    profit: 12000,
    revenue: 70000,
    branchName: "Baguio Branch",
  },
  {
    id: 5,
    branchId: 105,
    profit: 40000,
    revenue: 200000,
    branchName: "Makati Branch",
  },
];
