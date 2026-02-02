import { NotificationType } from '@root/generated/prisma/enums';
import { StockNotificationTitle } from './enum.stock-notification';
import { PurchaseStockInfo } from '@/types/notification/notification-details';
import { NotificationService } from './notification.service';

export class StockNotificationService extends NotificationService {
  private notificationType = NotificationType.STOCK;

  public async createStockPurchaseNotification(purchaseInfo: PurchaseStockInfo) {
    return await this.notify({
      type: this.notificationType,
      title: StockNotificationTitle.ADDED_TO_STOCK,
      message: `Stock for ${purchaseInfo.productName} has been added to ${purchaseInfo.branchName} by ${purchaseInfo.user}.`,
    });
  }

  public async createNegativeStockNotification(productName: string, branchName: string) {
    return await this.notify({
      type: this.notificationType,
      title: StockNotificationTitle.NEGATIVE_STOCK,
      message: `Detected negative stock for ${productName} at ${branchName}.`,
    });
  }

  public async createLowStockNotification(productName: string, branchName: string) {
    return await this.notify({
      type: this.notificationType,
      title: StockNotificationTitle.LOW_STOCK,
      message: `Branch ${branchName} has low stock of product ${productName}.`,
    });
  }
}
