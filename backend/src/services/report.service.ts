import { prisma } from '@root/lib/prisma';
import createHttpError from 'http-errors';
import { getTotalDamageAmount } from './transaction';
import { opexService } from './opex.service';
import { BranchFinancialReport, ProductReportQuery } from '@/types/report.types';
import { calculateSkip } from '@/helpers';
import { Prisma } from '@root/generated/prisma/client';

const ITEM_LIMIT = 30;

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
  const skip = calculateSkip(query?.page ?? 1, ITEM_LIMIT);
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

  return prisma.productReport.findMany({
    orderBy: { productId: 'asc' },
    include: {
      product: productDetails ?? false,
    },
    take: ITEM_LIMIT,
    skip,
    where,
  });
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
  const netProfit = profit - totalExpenses;
  return Math.max(0, netProfit); // Compare two numbers and return the largest
};

const getRemainingRequiredProfit = (profit: number, totalExpenses: number) => {
  const remainingRequiredProfit = totalExpenses - profit;
  return Math.max(0, remainingRequiredProfit);
};

export const getFinancialReport = async (branchId: number) => {
  const reports = await reportService.getBranchReportByBranchId(branchId);
  const totalExpenses = await opexService.getTotalOpex(branchId);
  const profit = reports?.profit ?? 0;
  const netProfit = getNetProfit(profit, totalExpenses);
  const remainingRequiredProfit = getRemainingRequiredProfit(profit, totalExpenses);
  const financialReport: BranchFinancialReport = {
    ...reports,
    netProfit,
    remainingRequiredProfit,
    operationExpenses: totalExpenses,
  };
  return financialReport;
};

export const reportService = {
  getMonthlyReports,
  getCurrentMonthReport,
  getProductReports,
  getProductReportByProductId,
  getBranchReports,
  getBranchReportByBranchId,
  getFinancialReport,
};
