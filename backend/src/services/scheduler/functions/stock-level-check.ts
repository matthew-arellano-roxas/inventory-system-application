import { StockNotificationService } from '@/services/notification/stock-notification-service';
import { prisma } from '@root/lib/prisma';

const LOW_STOCK_THRESHOLD = 30;

export async function stockLevelCheck(): Promise<void> {
  const stockNotificationService = new StockNotificationService();

  const reports = await prisma.productReport.findMany({
    where: {
      stock: {
        lte: LOW_STOCK_THRESHOLD,
      },
    },
    select: {
      stock: true,
      product: {
        select: {
          name: true,
          branch: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  for (const report of reports) {
    const productName = report.product?.name;
    const branchName = report.product?.branch?.name;

    // Hard guard — guarantees valid inputs
    if (!productName || !branchName) {
      continue;
    }

    if (report.stock < 0) {
      await stockNotificationService.createNegativeStockNotification(productName, branchName);
      continue;
    }

    await stockNotificationService.createLowStockNotification(productName, branchName);
  }
}
