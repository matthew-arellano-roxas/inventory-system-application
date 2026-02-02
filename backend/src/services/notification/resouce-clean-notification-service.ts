import { NotificationType } from '@root/generated/prisma/enums';
import { ResourceNotificationTitle } from './enum.resouce-notification';
import { NotificationService } from '@/services/notification/notification.service';

export class ResourceCleanNotificationServices extends NotificationService {
  private notificationType: NotificationType = NotificationType.RESOURCE;
  private notificationTitle: ResourceNotificationTitle = ResourceNotificationTitle.RESOURCE_CLEANUP;
  async createResourceCleanNotification() {
    return await this.notify({
      type: this.notificationType,
      title: this.notificationTitle,
      message: 'Resources have been cleaned up.',
    });
  }
}
