import { prisma } from '@root/lib/prisma';
import createHttpError from 'http-errors';
import { calculateSkip } from '@/helpers';
import { Prisma } from '@root/generated/prisma/client';
import { TransactionType } from '@root/generated/prisma/enums';
import { addDays, startOfDay } from 'date-fns';
import { DailyReportQuery, ProductReportQuery, ProductReportSummary } from '@/types/report.types';
import { getManilaMonthStart, getMonthTotals } from './report-period.service';

const ITEM_LIMIT = 30;

const buildProductReportWhere = (query?: ProductReportQuery): Prisma.ProductReportWhereInput => {
  const where: Prisma.ProductReportWhereInput = {};
  const productWhere: Prisma.ProductWhereInput = {};

  if (query?.search) {
    productWhere.name = {
      contains: query.search,
      mode: 'insensitive',
    };
  }

  if (query?.productId) productWhere.id = query.productId;
  if (query?.branchId) productWhere.branchId = query.branchId;
  if (Object.keys(productWhere).length > 0) where.product = productWhere;

  return where;
};

export const getMonthlyReports = () =>
  prisma.monthlyReport.findMany({
    orderBy: { date: 'desc' },
    take: 6,
  });

export const getDailyReports = async (query?: DailyReportQuery) => {
  if (query?.branchId != null) {
    const reports = await prisma.dailyReport.findMany({
      where: { branchId: query.branchId },
      orderBy: { date: 'desc' },
      take: 7,
    });

    return reports.reverse();
  }

  const reports = await prisma.dailyReport.groupBy({
    by: ['date'],
    _sum: {
      revenue: true,
      profit: true,
    },
    orderBy: { date: 'desc' },
    take: 7,
  });

  return reports.reverse().map((report, index) => ({
    id: index + 1,
    date: report.date,
    revenue: report._sum.revenue ?? 0,
    profit: report._sum.profit ?? 0,
  }));
};

export const getCurrentMonthReport = async () => {
  const currentMonthStart = getManilaMonthStart(new Date());
  const totals = await getMonthTotals(prisma, currentMonthStart);

  return {
    revenue: totals.revenue,
    profit: totals.profit,
    damage: totals.damage,
  };
};

export const getCurrentDayReport = async (query?: DailyReportQuery) => {
  const dayStart = startOfDay(new Date());
  const nextDayStart = addDays(dayStart, 1);

  const [transactionItems, damageAggregate] = await Promise.all([
    prisma.transactionItem.findMany({
      where: {
        createdAt: {
          gte: dayStart,
          lt: nextDayStart,
        },
        transactionType: {
          in: [TransactionType.SALE, TransactionType.RETURN],
        },
        ...(query?.branchId != null
          ? {
              transaction: {
                branchId: query.branchId,
              },
            }
          : {}),
      },
      select: {
        price: true,
        quantity: true,
        transactionType: true,
        product: {
          select: {
            costPerUnit: true,
          },
        },
      },
    }),
    prisma.transaction.aggregate({
      where: {
        type: TransactionType.DAMAGE,
        createdAt: {
          gte: dayStart,
          lt: nextDayStart,
        },
        ...(query?.branchId != null ? { branchId: query.branchId } : {}),
      },
      _sum: {
        totalAmount: true,
      },
    }),
  ]);

  const totals = transactionItems.reduce(
    (acc, item) => {
      const amount = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const costPerUnit = Number(item.product.costPerUnit) || 0;
      const grossProfit = amount - costPerUnit * quantity;
      const direction = item.transactionType === TransactionType.RETURN ? -1 : 1;

      acc.revenue += amount * direction;
      acc.profit += grossProfit * direction;

      return acc;
    },
    { revenue: 0, profit: 0 },
  );

  return {
    revenue: totals.revenue,
    profit: totals.profit,
    damage: damageAggregate._sum.totalAmount ?? 0,
  };
};

export const getProductReports = (query?: ProductReportQuery) => {
  const productDetails = query?.product_details;
  const where = buildProductReportWhere(query);
  const take = query?.page != null ? ITEM_LIMIT : query?.limit;
  const skip = query?.page != null ? calculateSkip(query.page, ITEM_LIMIT) : undefined;
  const orderBy: Prisma.ProductReportOrderByWithRelationInput[] =
    query?.limit != null && query.page == null
      ? [{ revenue: 'desc' }, { productId: 'asc' }]
      : [{ productId: 'asc' }];

  return prisma.productReport.findMany({
    orderBy,
    include: {
      product: productDetails ?? false,
    },
    ...(take != null ? { take } : {}),
    ...(skip != null ? { skip } : {}),
    where,
  });
};

export const getProductReportCount = (query?: ProductReportQuery) =>
  prisma.productReport.count({
    where: buildProductReportWhere(query),
  });

const getSummaryProductReports = (
  where: Prisma.ProductReportWhereInput,
  orderBy: Prisma.ProductReportOrderByWithRelationInput[],
) =>
  prisma.productReport.findMany({
    where,
    orderBy,
    take: 5,
    include: {
      product: true,
    },
  });

export const getProductReportSummary = async (
  query?: ProductReportQuery,
): Promise<ProductReportSummary> => {
  const where = buildProductReportWhere(query);
  const lowStockWhere: Prisma.ProductReportWhereInput = {
    ...where,
    stock: { lte: 10 },
  };

  const [stockAggregate, lowStockCount, lowStockReports] = await Promise.all([
    prisma.productReport.aggregate({
      where,
      _sum: {
        stock: true,
      },
    }),
    prisma.productReport.count({
      where: lowStockWhere,
    }),
    getSummaryProductReports(lowStockWhere, [{ stock: 'asc' }, { productId: 'asc' }]),
  ]);

  return {
    totalStock: Number(stockAggregate._sum.stock) || 0,
    lowStockCount,
    lowStockReports,
  };
};

export const getProductReportByProductId = async (id: number) => {
  const report = await prisma.productReport.findFirst({
    where: { productId: id },
    include: {
      product: {
        select: { name: true },
      },
    },
  });

  if (!report) throw new createHttpError.NotFound('Product Report Not Found.');

  const { product, ...rest } = report;

  return {
    ...rest,
    productName: product.name,
  };
};

export const getBranchReports = async () => {
  const reports = await prisma.branchReport.findMany({
    orderBy: { branchId: 'asc' },
    include: {
      branch: {
        select: { name: true },
      },
    },
  });

  return reports.map(({ branch, ...report }) => ({
    ...report,
    branchName: branch.name,
  }));
};

export const getBranchReportByBranchId = async (id: number) => {
  const report = await prisma.branchReport.findFirst({
    where: { branchId: id },
    include: {
      branch: {
        select: { name: true },
      },
    },
  });

  if (!report) throw new createHttpError.NotFound('Branch Report Not Found.');

  const { branch, ...rest } = report;

  return {
    ...rest,
    branchName: branch.name,
  };
};
