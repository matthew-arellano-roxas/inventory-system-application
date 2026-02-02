import { logger } from '@/config';
import { prisma } from '@root/lib/prisma';
import { subDays } from 'date-fns';

export interface CleanupResult {
  found: number;
  deleted: number;
}

/**
 * Cleans up old notifications.
 * Default retention: 90 days
 */
export async function cleanupOldNotifications(retentionDays = 90): Promise<CleanupResult> {
  const cutoffDate = subDays(new Date(), retentionDays);

  // 1️⃣ Dry run — count first
  const found = await prisma.notification.count({
    where: {
      createdAt: { lt: cutoffDate },
    },
  });

  logger.info(
    `[Notification Cleanup] Found ${found} notifications older than ${retentionDays} days`,
  );

  if (found === 0) {
    return { found: 0, deleted: 0 };
  }

  // 2️⃣ Delete
  const { count: deleted } = await prisma.notification.deleteMany({
    where: {
      createdAt: { lt: cutoffDate },
    },
  });

  logger.info(`[Notification Cleanup] Deleted ${deleted} notifications`);

  return { found, deleted };
}
