import { logger } from '@/config';
import { invalidateCache } from '@/middlewares/cacheMiddleware';
import { ROUTE } from '@/routes/route.constants';
import { getIO } from '@/socket';
import { NotificationBody, NotificationPayload } from '@/types/notification/notification-details';
import { prisma } from '@root/lib/prisma';
import { Server } from 'socket.io';

export class NotificationService {
  private serviceEventName = 'notification';

  private get socket(): Server {
    return getIO(); // called ONLY when sending
  }

  private readonly notificationEventName: string = 'notification';

  protected async saveNotification(notification: NotificationPayload) {
    const dateNow = new Date();
    return await prisma.notification.create({
      data: {
        type: notification.type,
        title: notification.title,
        message: notification.message,
        createdAt: dateNow,
      },
    });
  }

  protected sendNotification(title: string, message: string) {
    this.socket.emit(this.serviceEventName, {
      title,
      message,
    } as NotificationBody);
  }

  protected async notify(payload: NotificationPayload) {
    const notification = await this.saveNotification({
      type: payload.type,
      title: payload.title,
      message: payload.message,
    });
    this.sendNotification(notification.title, notification.message);
    invalidateCache(ROUTE.NOTIFICATION);
    logger.info(`[Notification] ${notification.title}: ${notification.message}`);
    return notification;
  }

  public async getNotifications() {
    return await prisma.notification.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
    });
  }
}
