import { PurchaseStockInfo } from '@/types/announcement.types';
import { AnnouncementType } from '@root/generated/prisma/enums';
import { processAnnouncement } from '@/services/announcement';
import { Announcement } from '@root/generated/prisma/client';

export enum StockAnnouncementTitle {
  LOW_STOCK = 'Low Stock',
  OUT_OF_STOCK = 'Out of Stock',
  ADDED_TO_STOCK = 'Added to Stock',
  NEGATIVE_STOCK = 'Negative Stock',
}

const announcementType = AnnouncementType.STOCK;

export const createStockPurchaseAnnouncement = async (
  purchaseInfo: PurchaseStockInfo,
): Promise<Announcement> => {
  const announcement = await processAnnouncement({
    type: announcementType,
    title: StockAnnouncementTitle.ADDED_TO_STOCK,
    message: `Stock for ${purchaseInfo.productName} has been added to ${purchaseInfo.branchName} by ${purchaseInfo.user}.`,
  });
  return announcement;
};

export const createLowStockAnnouncement = async (
  productName: string,
  branchName: string,
): Promise<Announcement> => {
  const announcement = await processAnnouncement({
    type: announcementType,
    title: StockAnnouncementTitle.LOW_STOCK,
    message: `Branch ${branchName} has low stock of product ${productName}.`,
  });
  return announcement;
};

export const createNegativeStockAnnouncement = async (
  productName: string,
  branchName: string,
): Promise<Announcement> => {
  const announcement = await processAnnouncement({
    type: announcementType,
    title: StockAnnouncementTitle.NEGATIVE_STOCK,
    message: `Detected negative stock for ${productName} at ${branchName}.`,
  });
  return announcement;
};
