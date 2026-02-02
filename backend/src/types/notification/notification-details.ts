import { Notification } from '@root/generated/prisma/client';

export type NotificationPayload = Omit<Notification, 'id' | 'createdAt'>;
export type NotificationDetails = Omit<NotificationPayload, 'type'>;
export type PurchaseStockInfo = {
  user: string;
  productName: string;
  branchName: string;
};
export type NotificationBody = Pick<NotificationDetails, 'title' | 'message'>;
