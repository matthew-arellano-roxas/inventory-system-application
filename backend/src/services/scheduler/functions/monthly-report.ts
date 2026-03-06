import { prisma } from '@root/lib/prisma';
import { logger } from '@/config';
import { resetReports } from './report-resetter';

const REPORT_TIMEZONE = 'Asia/Manila';

function getManilaMonthWindow(referenceDate: Date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: REPORT_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(referenceDate);

  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);

  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    throw new Error('Unable to resolve Manila month window.');
  }

  const previousMonthYear = month === 1 ? year - 1 : year;
  const previousMonth = month === 1 ? 12 : month - 1;

  const currentMonthStart = new Date(
    `${String(year)}-${String(month).padStart(2, '0')}-01T00:00:00+08:00`,
  );
  const reportMonthStart = new Date(
    `${String(previousMonthYear)}-${String(previousMonth).padStart(2, '0')}-01T00:00:00+08:00`,
  );

  return { currentMonthStart, reportMonthStart };
}

export async function createMonthlyReport() {
  const currentDate = new Date();
  const { currentMonthStart, reportMonthStart } = getManilaMonthWindow(currentDate);
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

    const branchReport = await tx.branchReport
      .aggregate({
        _sum: {
          revenue: true,
          profit: true,
        },
      })
      .then((b) => {
        return {
          sales: b._sum.revenue ?? 0,
          profit: b._sum.profit ?? 0,
        };
      });

    await tx.monthlyReport.create({
      data: {
        date: reportMonthStart,
        revenue: branchReport.sales,
        profit: branchReport.profit,
      },
    });
    await resetReports(tx);
  });
}
