export * from './auth';
export * from './logger';
export * from './cache';
export * from './logger';
export * from './rate-limit';
export * from './cors';

export const serverConfig = {
  port: Number(process.env.PORT) || 4000,
  databaseUrl: process.env.DATABASE_URL!,
  allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [],
};
