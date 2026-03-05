import { prisma } from '@root/lib/prisma';
import { TransactionType } from '@root/generated/prisma/enums';
import { addDays } from 'date-fns';

const REPORT_TIMEZONE = 'Asia/Manila';

function getManilaDayStart(referenceDate: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(referenceDate);

  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  if (!year || !month || !day) {
    throw new Error('Unable to resolve Manila day window.');
  }

  return new Date(`${year}-${month}-${day}T00:00:00+08:00`);
}

const getDailyWindow = (reportDate?: Date) => {
  if (reportDate) {
    const dayStart = getManilaDayStart(reportDate);
    const nextDayStart = addDays(dayStart, 1);
    return { dayStart, nextDayStart };
  }

  const manilaTodayStart = getManilaDayStart(new Date());
  const dayStart = addDays(manilaTodayStart, -1);
  const nextDayStart = manilaTodayStart;

  return {
    dayStart,
    nextDayStart,
  };
};

export async function createDailyReport(reportDate?: Date) {
  const { dayStart, nextDayStart } = getDailyWindow(reportDate);

  const [branches, transactionItems] = await Promise.all([
    prisma.branch.findMany({
      select: { id: true },
      orderBy: { id: 'asc' },
    }),
    prisma.transactionItem.findMany({
      where: {
        createdAt: {
          gte: dayStart,
          lt: nextDayStart,
        },
        transactionType: {
          in: [TransactionType.SALE, TransactionType.RETURN],
        },
      },
      select: {
        price: true,
        quantity: true,
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
    }),
  ]);

  const totalsByBranch = new Map<number, { revenue: number; profit: number }>(
    branches.map((branch) => [branch.id, { revenue: 0, profit: 0 }]),
  );

  for (const item of transactionItems) {
    const totals = totalsByBranch.get(item.transaction.branchId);

    if (!totals) continue;

    const amount = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const costPerUnit = Number(item.product.costPerUnit) || 0;
    const grossProfit = amount - costPerUnit * quantity;
    const direction = item.transactionType === TransactionType.RETURN ? -1 : 1;

    totals.revenue += amount * direction;
    totals.profit += grossProfit * direction;
  }

  return Promise.all(
    branches.map((branch) => {
      const totals = totalsByBranch.get(branch.id) ?? { revenue: 0, profit: 0 };

      return prisma.dailyReport.upsert({
        where: {
          branchId_date: {
            branchId: branch.id,
            date: dayStart,
          },
        },
        update: totals,
        create: {
          branchId: branch.id,
          date: dayStart,
          ...totals,
        },
      });
    }),
  );
}
