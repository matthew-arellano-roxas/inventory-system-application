import { Router } from 'express';
import { ReportService } from '@/services/reports/report.service';
import { ReportController } from '@/controllers';

const reportService = new ReportService();
const reportController = new ReportController(reportService);

const reportRoute: Router = Router();

reportRoute.get('/monthly', reportController.getMonthlyReport.bind(reportController));
reportRoute.get('/current-month', reportController.getCurrentMonthReport.bind(reportController));
reportRoute.get('/product', reportController.getProductReport.bind(reportController));
reportRoute.get(
  '/product/:productId',
  reportController.getProductReportByProductId.bind(reportController),
);
reportRoute.get('/branch', reportController.getBranchReport.bind(reportController));
reportRoute.get(
  '/branch/:branchId',
  reportController.getBranchReportByBranchId.bind(reportController),
);

export { reportRoute };
