import {
  getBranchReportByBranchId,
  getBranchReports,
  getCurrentDayReport,
  getCurrentMonthReport,
  getDailyReports,
  getMonthlyReports,
  getProductReportByProductId,
  getProductReportCount,
  getProductReportSummary,
  getProductReports,
} from './report-read.service';
import { getFinancialReportByBranchId, getFinancialReportList } from './report-financial.service';
import { getInventoryExportFile } from './report-export.service';

export const reportService = {
  getMonthlyReports,
  getDailyReports,
  getCurrentDayReport,
  getCurrentMonthReport,
  getProductReports,
  getProductReportCount,
  getProductReportSummary,
  getProductReportByProductId,
  getBranchReports,
  getBranchReportByBranchId,
  getFinancialReportByBranchId,
  getFinancialReportList,
  getInventoryExportFile,
};
