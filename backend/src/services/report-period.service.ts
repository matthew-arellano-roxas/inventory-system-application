import { prisma } from '@root/lib/prisma';
import { Prisma } from '@root/generated/prisma/client';
import { TransactionType } from '@root/generated/prisma/enums';
import { addMonths } from 'date-fns';

const REPORT_TIMEZONE = 'Asia/Manila';

type ReportClient = Prisma.TransactionClient | typeof prisma;

type Totals = {
  revenue: number;
  profit: number;
  damage: number;
};

function getManilaDateParts(referenceDate: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(referenceDate);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;

  if (!year || !month) {
    throw new Error('Unable to resolve Manila month window.');
  }

  return { year, month };
}

export function getManilaMonthStart(referenceDate: Date) {
  const { year, month } = getManilaDateParts(referenceDate);
  return new Date(`${year}-${month}-01T00:00:00+08:00`);
}

export function getMonthKey(referenceDate: Date) {
  const { year, month } = getManilaDateParts(referenceDate);
  return `${year}-${month}`;
}

export function getMonthWindow(monthStart: Date) {
  return {
    monthStart,
    nextMonthStart: addMonths(monthStart, 1),
  };
}

async function getMonthTransactionItems(
  client: ReportClient,
  monthStart: Date,
  nextMonthStart: Date,
) {
  return client.transactionItem.findMany({
    where: {
      createdAt: {
        gte: monthStart,
        lt: nextMonthStart,
      },
      transactionType: {
        in: [TransactionType.SALE, TransactionType.RETURN, TransactionType.DAMAGE],
      },
    },
    select: {
      productId: true,
      quantity: true,
      price: true,
      transactionType: true,
      transaction: {
        select: {
          branchId: true,
        },
      },
      product: {
        select: {
          costPerUnit: true,
        },
      },
    },
  });
}

export async function getMonthTotals(client: ReportClient, monthStart: Date): Promise<Totals> {
  const { nextMonthStart } = getMonthWindow(monthStart);
  const items = await getMonthTransactionItems(client, monthStart, nextMonthStart);

  return items.reduce<Totals>(
    (acc, item) => {
      const amount = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const costPerUnit = Number(item.product.costPerUnit) || 0;

      if (item.transactionType === TransactionType.SALE) {
        acc.revenue += amount;
        acc.profit += amount - costPerUnit * quantity;
        return acc;
      }

      if (item.transactionType === TransactionType.RETURN) {
        acc.revenue -= amount;
        acc.profit -= amount - costPerUnit * quantity;
        return acc;
      }

      acc.damage += amount;
      acc.profit -= amount;
      return acc;
    },
    { revenue: 0, profit: 0, damage: 0 },
  );
}

export async function rebuildCurrentMonthReports(client: ReportClient = prisma) {
  const currentMonthStart = getManilaMonthStart(new Date());
  const { nextMonthStart } = getMonthWindow(currentMonthStart);
  const items = await getMonthTransactionItems(client, currentMonthStart, nextMonthStart);

  const productTotals = new Map<number, { revenue: number; profit: number }>();
  const branchTotals = new Map<number, { revenue: number; profit: number }>();

  for (const item of items) {
    const amount = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const costPerUnit = Number(item.product.costPerUnit) || 0;
    const branchId = item.transaction.branchId;

    let revenueDelta = 0;
    let profitDelta = 0;

    if (item.transactionType === TransactionType.SALE) {
      revenueDelta = amount;
      profitDelta = amount - costPerUnit * quantity;
    } else if (item.transactionType === TransactionType.RETURN) {
      revenueDelta = -amount;
      profitDelta = -(amount - costPerUnit * quantity);
    } else {
      profitDelta = -amount;
    }

    const currentProductTotals = productTotals.get(item.productId) ?? { revenue: 0, profit: 0 };
    currentProductTotals.revenue += revenueDelta;
    currentProductTotals.profit += profitDelta;
    productTotals.set(item.productId, currentProductTotals);

    const currentBranchTotals = branchTotals.get(branchId) ?? { revenue: 0, profit: 0 };
    currentBranchTotals.revenue += revenueDelta;
    currentBranchTotals.profit += profitDelta;
    branchTotals.set(branchId, currentBranchTotals);
  }

  await client.productReport.updateMany({
    data: {
      revenue: 0,
      profit: 0,
    },
  });

  await client.branchReport.updateMany({
    data: {
      revenue: 0,
      profit: 0,
    },
  });

  await Promise.all(
    Array.from(productTotals.entries()).map(([productId, totals]) =>
      client.productReport.update({
        where: { productId },
        data: totals,
      }),
    ),
  );

  await Promise.all(
    Array.from(branchTotals.entries()).map(([branchId, totals]) =>
      client.branchReport.update({
        where: { branchId },
        data: totals,
      }),
    ),
  );
}

export async function ensureMonthlyReportsAreCurrent(client: ReportClient = prisma) {
  const currentMonthStart = getManilaMonthStart(new Date());
  const earliestTransaction = await client.transaction.findFirst({
    orderBy: { createdAt: 'asc' },
    select: { createdAt: true },
  });

  if (!earliestTransaction) {
    return { created: 0 };
  }

  const existingReports = await client.monthlyReport.findMany({
    where: {
      date: {
        lt: currentMonthStart,
      },
    },
    select: {
      date: true,
    },
  });

  const existingMonthKeys = new Set(existingReports.map((report) => getMonthKey(report.date)));
  let cursor = getManilaMonthStart(earliestTransaction.createdAt);
  let created = 0;

  while (cursor < currentMonthStart) {
    const monthKey = getMonthKey(cursor);

    if (!existingMonthKeys.has(monthKey)) {
      const totals = await getMonthTotals(client, cursor);
      await client.monthlyReport.create({
        data: {
          date: cursor,
          revenue: totals.revenue,
          profit: totals.profit,
          stock: 0,
        },
      });
      created += 1;
    }

    cursor = addMonths(cursor, 1);
  }

  return { created };
}
