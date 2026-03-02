import { prisma } from '@root/lib/prisma';
import createHttpError from 'http-errors';
import { getTotalDamageAmount } from './transaction';
import { opexService } from './opex.service';
import {
  BranchFinancialReport,
  ProductReportQuery,
  ProductReportSummary,
} from '@/types/report.types';
import { calculateSkip } from '@/helpers';
import { Prisma } from '@root/generated/prisma/client';

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

  if (query?.productId) {
    productWhere.id = query.productId;
  }

  if (query?.branchId) {
    productWhere.branchId = query.branchId;
  }

  if (Object.keys(productWhere).length > 0) {
    where.product = productWhere;
  }

  return where;
};

// Monthly Reports
const getMonthlyReports = () => {
  return prisma.monthlyReport.findMany({
    orderBy: { date: 'desc' },
    take: 6,
  });
};

const getCurrentMonthReport = async () => {
  return prisma.branchReport
    .aggregate({
      _sum: {
        revenue: true,
        profit: true,
      },
    })
    .then(async (report) => {
      const damage = await getTotalDamageAmount();
      return { ...report._sum, damage };
    });
};

// Product Reports
const getProductReports = (query?: ProductReportQuery) => {
  const productDetails = query?.product_details;
  const where = buildProductReportWhere(query);

  return prisma.productReport.findMany({
    orderBy: { productId: 'asc' },
    include: {
      product: productDetails ?? false,
    },
    ...(query?.page != null
      ? {
          take: ITEM_LIMIT,
          skip: calculateSkip(query.page, ITEM_LIMIT),
        }
      : {}),
    where,
  });
};

const getProductReportCount = (query?: ProductReportQuery) => {
  return prisma.productReport.count({
    where: buildProductReportWhere(query),
  });
};

const getSummaryProductReports = (
  where: Prisma.ProductReportWhereInput,
  orderBy: Prisma.ProductReportOrderByWithRelationInput[],
) => {
  return prisma.productReport.findMany({
    where,
    orderBy,
    take: 5,
    include: {
      product: true,
    },
  });
};

const getProductReportSummary = async (
  query?: ProductReportQuery,
): Promise<ProductReportSummary> => {
  const where = buildProductReportWhere(query);
  const lowStockWhere: Prisma.ProductReportWhereInput = {
    ...where,
    stock: { lte: 10 },
  };

  const [stockAggregate, lowStockCount, topRevenueReports, lowStockReports] = await Promise.all([
    prisma.productReport.aggregate({
      where,
      _sum: {
        stock: true,
      },
    }),
    prisma.productReport.count({
      where: lowStockWhere,
    }),
    getSummaryProductReports(where, [{ revenue: 'desc' }, { productId: 'asc' }]),
    getSummaryProductReports(lowStockWhere, [{ stock: 'asc' }, { productId: 'asc' }]),
  ]);

  return {
    totalStock: Number(stockAggregate._sum.stock) || 0,
    lowStockCount,
    topRevenueReports,
    lowStockReports,
  };
};

const getProductReportByProductId = async (id: number) => {
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

// Branch Reports
const getBranchReports = async () => {
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

const getBranchReportByBranchId = async (id: number) => {
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

const getNetProfit = (profit: number, totalExpenses: number) => {
  return profit - totalExpenses;
};

export const getFinancialReportByBranchId = async (branchId: number) => {
  const reports = await reportService.getBranchReportByBranchId(branchId);
  const totalExpenses = await opexService.getTotalOpex(branchId);
  const profit = reports?.profit ?? 0;
  const netProfit = getNetProfit(profit, totalExpenses);
  const financialReport: BranchFinancialReport = {
    ...reports,
    netProfit,
    operationExpenses: totalExpenses,
  };
  return financialReport;
};

const getFinancialReportList = async () => {
  const reports = await reportService.getBranchReports();
  const financialReportList: BranchFinancialReport[] = [];
  for (const report of reports) {
    const totalExpenses = await opexService.getTotalOpex(report.branchId);
    const profit = report.profit ?? 0;
    const netProfit = getNetProfit(profit, totalExpenses);
    const financialReport: BranchFinancialReport = {
      ...report,
      netProfit,
      operationExpenses: totalExpenses,
    };
    financialReportList.push(financialReport);
  }
  return financialReportList;
};

export const reportService = {
  getMonthlyReports,
  getCurrentMonthReport,
  getProductReports,
  getProductReportCount,
  getProductReportSummary,
  getProductReportByProductId,
  getBranchReports,
  getBranchReportByBranchId,
  getFinancialReportByBranchId,
  getFinancialReportList,
};
