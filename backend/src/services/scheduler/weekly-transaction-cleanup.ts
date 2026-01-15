import cron from 'node-cron';
import { cleanupOldTransactions } from '@/services/scheduler/functions/transaction-cleanup';
import { cleanupStockMovements } from '@/services/scheduler/functions/stock-movement-cleanup';
import { logger } from '@/config';

export function scheduleWeeklyCleanup() {
  cron.schedule('0 0 2 * * 0', async () => {
    try {
      await cleanupOldTransactions();
      await cleanupStockMovements();
    } catch (err) {
      logger.error(err);
    }
  });
}
