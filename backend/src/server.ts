import dotenv from 'dotenv';
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

import 'express-async-error';
import express from 'express';
import http from 'http';

import { logger, serverConfig, corsOptions, apiRateLimiter } from '@/config';
import { checkDatabaseConnection } from '@/helpers/checkdatabase';
import {
  transactionRoute,
  annoucementRoute,
  productRoute,
  branchRoute,
  categoryRoute,
  stockRoute,
  reportRoute,
  opexRoute,
} from '@/routes';

// Scheduler
import { dailyCheck, scheduleWeeklyCleanup, scheduleMonthlyReport } from '@/services';
import { requestLogger, protectedRoute, errorHandler } from '@/middlewares';
import cors from 'cors';
import { initSocketServer } from '@/socket';
const app = express();
const server = http.createServer(app);

app.use(apiRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors(corsOptions));
// Auth0 middleware
initSocketServer(server);

app.use(protectedRoute);
app.use('/api/product', productRoute);
app.use('/api/branch', branchRoute);
app.use('/api/category', categoryRoute);
app.use('/api/stock', stockRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/report', reportRoute);
app.use('/api/announcement', annoucementRoute);
app.use('/api/expenses', opexRoute);

app.use(errorHandler);

scheduleWeeklyCleanup();
dailyCheck();
scheduleMonthlyReport();

// Start server
(async () => {
  await checkDatabaseConnection(); // wait for DB connection
  server.listen(serverConfig.port, () => {
    logger.info(`Server running at http://localhost:${serverConfig.port}`);
  });
})();
