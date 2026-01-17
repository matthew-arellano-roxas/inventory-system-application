import { prisma } from '@root/lib/prisma';
import createHttpError from 'http-errors';
import { getTotalDamageAmount } from '../transaction';

export class ReportService {
  // Monthly Reports
  async getMonthlyReports() {
    return prisma.monthlyReport.findMany({
      orderBy: { date: 'desc' },
      take: 6,
    });
  }

  async getCurrentMonthReport() {
    return prisma.branchReport
      .aggregate({
        _sum: {
          sales: true,
          profit: true,
        },
      })
      .then(async (report) => {
        const damage = await getTotalDamageAmount();
        return { ...report._sum, damage };
      });
  }

  // Product Reports
  async getProductReports() {
    const reports = await prisma.productReport.findMany({
      orderBy: { productId: 'asc' },
      include: {
        product: {
          select: { name: true },
        },
      },
    });

    return reports.map(({ product, ...report }) => ({
      ...report,
      productName: product.name,
    }));
  }

  async getProductReportByProductId(id: number) {
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
  }

  // Branch Reports
  async getBranchReports() {
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
  }

  async getBranchReportByBranchId(id: number) {
    const report = await prisma.branchReport.findFirst({
      where: { branchId: id },
      include: {
        branch: {
          select: { name: true },
        },
      },
    });

    if (!report) return null;

    const { branch, ...rest } = report;

    return {
      ...rest,
      branchName: branch.name,
    };
  }
}
