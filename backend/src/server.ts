import 'dotenv/config';
import 'express-async-error';
import express from 'express';
import { auth } from 'express-openid-connect';
import http from 'http';

// Configs
import { logger, serverConfig } from '@/config';
import { authConfig } from '@/config';

// Routes
import errorHandler from '@/middlewares/errorhandler';

// Helpers
import { checkDatabaseConnection } from '@/helpers/checkdatabase';

// Routes
import { productRoute, branchRoute, categoryRoute } from '@/routes';

// Scheduler
import { dailyCheck, scheduleWeeklyCleanup } from '@/services/scheduler/clean-up';
import { stockRoute } from '@/routes/stock.route';
import { transactionRoute } from '@/routes/transaction.route';
import { reportRoute } from '@/routes/report.route';
import { requestLogger } from '@/middlewares/logger';
import cors from 'cors';
import { corsOptions } from '@/config/config,cors';
import { initSocketServer } from '@/socket';
import { apiRateLimiter } from '@/config/config.rate-limit';
import { notificationRoute } from './routes/notification.route';

const app = express();
const server = http.createServer(app);

app.use(apiRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors(corsOptions));
// Auth0 middleware
app.use(auth(authConfig));
initSocketServer(server);

app.use('/api/product', productRoute);
app.use('/api/branch', branchRoute);
app.use('/api/category', categoryRoute);
app.use('/api/stock', stockRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/report', reportRoute);
app.use('/api/notification', notificationRoute);

app.use(errorHandler);

scheduleWeeklyCleanup();
dailyCheck();

// Start server
(async () => {
  await checkDatabaseConnection(); // wait for DB connection
  server.listen(serverConfig.PORT, () => {
    logger.info(`Server running at http://localhost:${serverConfig.PORT}`);
  });
})();
