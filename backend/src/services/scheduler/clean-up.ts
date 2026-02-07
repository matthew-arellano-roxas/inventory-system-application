import cron from 'node-cron';
import { cleanupOldTransactions } from '@/services/scheduler/functions/transaction-cleanup';
import { cleanupStockMovements } from '@/services/scheduler/functions/stock-movement-cleanup';
import { logger } from '@/config';
import { stockLevelCheck } from './functions/stock-level-check';
import { cleanupOldAnnouncements } from './functions/notification-cleanup';
import { createMonthlyReport } from './functions/monthly-report';
import { createResourceCleanAnnouncement } from '../announcement/cleanup-announcement';

export function scheduleWeeklyCleanup() {
  cron.schedule(
    '0 0 2 * * 0',
    async () => {
      try {
        await cleanupOldTransactions();
        await cleanupStockMovements();
        await cleanupOldAnnouncements();
        await createResourceCleanAnnouncement();
        logger.info('[Cleanup] Weekly cleanup completed.');
      } catch (err) {
        logger.error(err);
      }
    },
    {
      timezone: 'Asia/Manila', // adjust to your server timezone
    },
  );
}

export function dailyCheck() {
  cron.schedule(
    '0 0 * * *',
    async () => {
      try {
        await stockLevelCheck();
        logger.info('[Cleanup] Daily check completed.');
      } catch (err) {
        logger.error(err);
      }
    },
    {
      timezone: 'Asia/Manila', // adjust to your server timezone
    },
  );
}

export function scheduleMonthlyReport() {
  cron.schedule(
    '0 0 1 * *',
    async () => {
      try {
        await createMonthlyReport();
        logger.info('[Cleanup] Monthly report created.');
        logger.info('[Cleanup] Reports reset.');
      } catch (err) {
        logger.error(err);
      }
    },
    {
      timezone: 'Asia/Manila',
    },
  );
}
