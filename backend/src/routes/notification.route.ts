import { NotificationController } from '@/controllers/notification.controller';
import { cacheMiddleware } from '@/middlewares/cacheMiddleware';
import { NotificationService } from '@/services/notification/notification.service';
import { Router } from 'express';

const notificationRoute: Router = Router();

const TTL = 60;
const notificationService = new NotificationService();
const notificationController = new NotificationController(notificationService);

notificationRoute.get(
  '/',
  cacheMiddleware(TTL),
  notificationController.getNotifications.bind(notificationController),
);

export { notificationRoute };
