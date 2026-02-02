import { ok } from '@/helpers';
import { NotificationService } from '@/services/notification/notification.service';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class NotificationController {
  private notificationService: NotificationService;
  constructor(notificationService: NotificationService) {
    this.notificationService = notificationService;
  }
  async getNotifications(req: Request, res: Response, _next: NextFunction) {
    const notification = await this.notificationService.getNotifications();
    res.status(StatusCodes.OK).json(ok(notification, 'Notifications retrieved'));
  }
}
