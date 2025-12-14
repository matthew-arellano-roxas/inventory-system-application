import { prisma } from '@prisma';
import { logger } from '@/config';

export const checkDatabaseConnection = async (): Promise<void> => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`; // forces a real connection
    logger.info('Database connected!');
  } catch (_error) {
    logger.error('Database connection failed!');
    process.exit(1); // exit app if DB is unreachable
  }
};
