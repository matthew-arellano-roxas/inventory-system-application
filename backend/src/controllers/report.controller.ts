import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import createHttpError from 'http-errors';
import { ok } from '@/helpers/response';
import { ReportService } from '@/services/reports/report.service';

export class ReportController {
  private reportService: ReportService;

  constructor(reportService: ReportService) {
    this.reportService = reportService;
  }

  async getMonthlyReport(req: Request, res: Response, _next: NextFunction) {
    const reports = await this.reportService.getMonthlyReports();
    res.status(StatusCodes.OK).json(ok(reports, 'Monthly report retrieved'));
  }

  async getCurrentMonthReport(req: Request, res: Response, _next: NextFunction) {
    const reports = await this.reportService.getCurrentMonthReport();
    res.status(StatusCodes.OK).json(ok(reports, 'Current month report retrieved'));
  }

  async getProductReport(req: Request, res: Response, _next: NextFunction) {
    const reports = await this.reportService.getProductReports();
    res.status(StatusCodes.OK).json(ok(reports, 'Product report retrieved'));
  }

  async getProductReportByProductId(req: Request, res: Response, _next: NextFunction) {
    const productId = Number(req.params.productId);
    if (Object.is(productId, NaN))
      throw new createHttpError.BadRequest('Please provide a valid product id');
    const reports = await this.reportService.getProductReportByProductId(productId);
    res.status(StatusCodes.OK).json(ok(reports, `Report for product ${productId} retrieved`));
  }

  async getBranchReport(req: Request, res: Response, _next: NextFunction) {
    const reports = await this.reportService.getBranchReports();
    res.status(StatusCodes.OK).json(ok(reports, 'Branch report retrieved'));
  }

  async getBranchReportByBranchId(req: Request, res: Response, _next: NextFunction) {
    const branchId = Number(req.params.branchId);
    if (Object.is(branchId, NaN))
      throw new createHttpError.BadRequest('Please provide a valid branch id');
    const reports = await this.reportService.getBranchReportByBranchId(branchId);
    res.status(StatusCodes.OK).json(ok(reports, `Report for branch ${branchId} retrieved`));
  }
}
