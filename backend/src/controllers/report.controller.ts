import { Response, Request, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import createHttpError from 'http-errors';
import { logger } from '@/config';
import { ok } from '@/helpers/response';
import { ReportService } from '@/services/reports/report.service';

export class ReportController {
  private reportService: ReportService;

  constructor(reportService: ReportService) {
    this.reportService = reportService;
  }

  async getMonthlyReport(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get stock movements');
    const stocks = await this.reportService.getMonthlyReports();
    res.status(StatusCodes.OK).json(ok(stocks, 'Stock movements retrieved'));
  }

  async getProductReport(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get stock movements');
    const stocks = await this.reportService.getProductReports();
    res.status(StatusCodes.OK).json(ok(stocks, 'Stock movements retrieved'));
  }

  async getProductReportByProductId(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get stock movements by product id');
    const productId = Number(req.params.productId);
    if (Object.is(productId, NaN))
      throw new createHttpError.BadRequest('Please provide a valid product id');
    const stocks = await this.reportService.getProductReportByProductId(productId);
    res
      .status(StatusCodes.OK)
      .json(ok(stocks, `Stock movements for product ${productId} retrieved`));
  }

  async getBranchReport(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get stock movements');
    const stocks = await this.reportService.getBranchReports();
    res.status(StatusCodes.OK).json(ok(stocks, 'Stock movements retrieved'));
  }

  async getBranchReportByBranchId(req: Request, res: Response, _next: NextFunction) {
    logger.info('Get stock movements by branch id');
    const branchId = Number(req.params.branchId);
    if (Object.is(branchId, NaN))
      throw new createHttpError.BadRequest('Please provide a valid branch id');
    const stocks = await this.reportService.getBranchReportByBranchId(branchId);
    res.status(StatusCodes.OK).json(ok(stocks, `Stock movements for branch ${branchId} retrieved`));
  }
}
