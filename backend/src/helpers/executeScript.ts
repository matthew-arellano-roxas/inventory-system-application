import { prisma } from '@root/lib/prisma';
import { TransactionType } from '@root/generated/prisma/enums';

function getUtcMonthStart(referenceDate: Date) {
  return new Date(Date.UTC(referenceDate.getUTCFullYear(), referenceDate.getUTCMonth(), 1));
}

function getJanuaryWindow(referenceDate: Date) {
  const year = referenceDate.getUTCFullYear();
  const januaryStart = new Date(Date.UTC(year, 0, 1));
  const februaryStart = new Date(Date.UTC(year, 1, 1));
  return { januaryStart, februaryStart };
}

export async function executeScript() {
  const now = new Date();
  const monthStart = getUtcMonthStart(now);
  const { januaryStart, februaryStart } = getJanuaryWindow(now);

  const result = await prisma.$transaction(async (tx) => {
    const monthlyDeleteResult = await tx.monthlyReport.deleteMany({
      where: {
        date: {
          gte: januaryStart,
          lt: februaryStart,
        },
      },
    });

    const transactionItems = await tx.transactionItem.findMany({
      where: {
        createdAt: {
          gte: monthStart,
        },
        transactionType: {
          in: [TransactionType.SALE, TransactionType.RETURN, TransactionType.DAMAGE],
        },
      },
      select: {
        productId: true,
        transactionType: true,
        quantity: true,
        price: true,
        product: {
          select: {
            costPerUnit: true,
            branchId: true,
          },
        },
      },
    });

    const productTotals = new Map<number, { revenue: number; profit: number }>();
    const branchTotals = new Map<number, { revenue: number; profit: number }>();

    for (const item of transactionItems) {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      const costPerUnit = Number(item.product.costPerUnit) || 0;

      let revenueDelta = 0;
      let profitDelta = 0;

      if (item.transactionType === TransactionType.SALE) {
        revenueDelta = price;
        profitDelta = price - costPerUnit * quantity;
      } else if (item.transactionType === TransactionType.RETURN) {
        revenueDelta = -price;
        profitDelta = -(price - costPerUnit * quantity);
      } else if (item.transactionType === TransactionType.DAMAGE) {
        profitDelta = -price;
      }

      const currentProductTotals = productTotals.get(item.productId) ?? { revenue: 0, profit: 0 };
      currentProductTotals.revenue += revenueDelta;
      currentProductTotals.profit += profitDelta;
      productTotals.set(item.productId, currentProductTotals);

      const branchId = item.product.branchId;
      const currentBranchTotals = branchTotals.get(branchId) ?? { revenue: 0, profit: 0 };
      currentBranchTotals.revenue += revenueDelta;
      currentBranchTotals.profit += profitDelta;
      branchTotals.set(branchId, currentBranchTotals);
    }

    await tx.productReport.updateMany({
      data: {
        revenue: 0,
        profit: 0,
      },
    });

    await tx.branchReport.updateMany({
      data: {
        revenue: 0,
        profit: 0,
      },
    });

    await Promise.all(
      Array.from(productTotals.entries()).map(([productId, totals]) =>
        tx.productReport.update({
          where: { productId },
          data: {
            revenue: totals.revenue,
            profit: totals.profit,
          },
        }),
      ),
    );

    await Promise.all(
      Array.from(branchTotals.entries()).map(([branchId, totals]) =>
        tx.branchReport.update({
          where: { branchId },
          data: {
            revenue: totals.revenue,
            profit: totals.profit,
          },
        }),
      ),
    );

    return {
      deletedMonthlyCount: monthlyDeleteResult.count,
      rebuildSourceItems: transactionItems.length,
    };
  });

  console.log(
    `[executeScript] Deleted ${result.deletedMonthlyCount} January monthly report(s). Rebuilt reports from ${monthStart.toISOString()} using ${result.rebuildSourceItems} transaction item(s).`,
  );
}
