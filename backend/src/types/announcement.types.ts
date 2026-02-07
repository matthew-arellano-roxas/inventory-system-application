import { Announcement } from '@root/generated/prisma/client';

export type AnnouncementPayload = Omit<Announcement, 'id' | 'createdAt'>;
export type AnnouncementDetails = Omit<AnnouncementPayload, 'type'>;
export type PurchaseStockInfo = {
  user: string;
  productName: string;
  branchName: string;
};
export type AnnouncementBody = Pick<AnnouncementDetails, 'title' | 'message'>;
