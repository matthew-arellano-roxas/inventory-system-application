import { nowPH } from '@/helpers';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { prisma } from '@prisma';

export const SalesService = {
  async getBranchSales() {
    const dateNow = nowPH();
    const oneMonthAgo = subMonths(new Date(dateNow), 1);

    // 1. Get ALL branches first
    const allBranches = await prisma.branch.findMany({
      select: { id: true, name: true },
    });

    // 2. Get the sales sums for branches that actually had transactions
    const branchSumOfPayments = await prisma.transactionDetail.groupBy({
      by: ['branchId'],
      where: {
        transactionDate: { lt: dateNow, gt: oneMonthAgo },
      },
      _sum: { payment: true },
    });

    // 3. Map through ALL branches and "attach" the sales
    const branchSales = allBranches.map((branch) => {
      // Find if this specific branch exists in our sales aggregation
      const salesData = branchSumOfPayments.find((s) => s.branchId === branch.id);

      return {
        branchId: branch.id,
        branchName: branch.name,
        // If found, use the sum; otherwise, default to 0
        sales: salesData?._sum.payment ?? 0,
      };
    });

    return branchSales;
  },

  async getMonthlySalesHistory() {
    const monthsToFetch = 6;
    const history = [];

    // 1. Iterate backwards from 0 to 5 (last 6 months)
    for (let i = 0; i < monthsToFetch; i++) {
      const targetDate = subMonths(new Date(), i);
      const start = startOfMonth(targetDate);
      const end = endOfMonth(targetDate);

      // 2. Aggregate sum for this specific month range
      const aggregate = await prisma.transactionDetail.aggregate({
        where: {
          transactionDate: {
            gte: start,
            lte: end,
          },
        },
        _sum: {
          payment: true,
        },
      });

      // 3. Store the result with a label (e.g., "Jan 2024")
      history.push({
        month: format(start, 'MMM'),
        totalSales: aggregate._sum.payment ?? 0,
        timestamp: start, // Useful for sorting on frontend
      });
    }

    // Reverse it so it goes from oldest to newest (standard for charts)
    return history.reverse();
  },
};
