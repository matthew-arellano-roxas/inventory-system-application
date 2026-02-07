import { StatusCodes } from 'http-status-codes';
import createHttpError from 'http-errors';
import { ok } from '@/helpers/response';
import { Controller } from '@/types/controller.type';
import { reportService } from '@/services';

// Get monthly reports
const getMonthlyReport: Controller = async (req, res, _next) => {
  const reports = await reportService.getMonthlyReports();
  res.status(StatusCodes.OK).json(ok(reports, 'Monthly report retrieved'));
};

// Get current month report
const getCurrentMonthReport: Controller = async (req, res, _next) => {
  const reports = await reportService.getCurrentMonthReport();
  res.status(StatusCodes.OK).json(ok(reports, 'Current month report retrieved'));
};

// Get product reports
const getProductReport: Controller = async (req, res, _next) => {
  const reports = await reportService.getProductReports();
  res.status(StatusCodes.OK).json(ok(reports, 'Product report retrieved'));
};

// Get product report by product ID
const getProductReportByProductId: Controller = async (req, res, _next) => {
  const productId = Number(req.params.productId);

  if (Object.is(productId, NaN)) {
    throw new createHttpError.BadRequest('Please provide a valid product id');
  }

  const reports = await reportService.getProductReportByProductId(productId);
  res.status(StatusCodes.OK).json(ok(reports, `Report for product ${productId} retrieved`));
};

// Get branch reports
const getBranchReport: Controller = async (req, res, _next) => {
  const reports = await reportService.getBranchReports();
  res.status(StatusCodes.OK).json(ok(reports, 'Branch report retrieved'));
};

// Get branch report by branch ID
const getBranchReportByBranchId: Controller = async (req, res, _next) => {
  const branchId = Number(req.params.branchId);
  if (Object.is(branchId, NaN)) {
    throw new createHttpError.BadRequest('Please provide a valid branch id');
  }
  const financialReport = await reportService.getFinancialReport(branchId);
  res.status(StatusCodes.OK).json(ok(financialReport, `Report for branch ${branchId} retrieved`));
};

export const reportController = {
  getMonthlyReport,
  getCurrentMonthReport,
  getProductReport,
  getProductReportByProductId,
  getBranchReport,
  getBranchReportByBranchId,
};
