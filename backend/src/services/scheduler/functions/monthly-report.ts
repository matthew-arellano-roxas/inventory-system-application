import { prisma } from '@root/lib/prisma';
import { logger } from '@/config';
import { resetReports } from './report-resetter';
import { getManilaMonthStart, getMonthTotals } from '@/services/report-period.service';
import { addMonths } from 'date-fns';

export async function createMonthlyReport() {
  const currentDate = new Date();
  const currentMonthStart = getManilaMonthStart(currentDate);
  const reportMonthStart = addMonths(currentMonthStart, -1);
  const nextReportMonthStart = currentMonthStart;

  return await prisma.$transaction(async (tx) => {
    const existingMonthlyReport = await tx.monthlyReport.findFirst({
      where: {
        date: {
          gte: reportMonthStart,
          lt: nextReportMonthStart,
        },
      },
      orderBy: { date: 'desc' },
    });

    if (existingMonthlyReport) {
      logger.warn(
        `[Scheduler] Monthly report for period ${reportMonthStart.toISOString()} already exists (id=${existingMonthlyReport.id}). Skipping duplicate create/reset.`,
      );
      return existingMonthlyReport;
    }

    const totals = await getMonthTotals(tx, reportMonthStart);

    await tx.monthlyReport.create({
      data: {
        date: reportMonthStart,
        revenue: totals.revenue,
        profit: totals.profit,
      },
    });
    await resetReports(tx);
  });
}
