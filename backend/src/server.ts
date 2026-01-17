import 'dotenv/config';
import 'express-async-error';
import express from 'express';
import { auth } from 'express-openid-connect';

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
import { scheduleWeeklyCleanup } from '@/services/scheduler/weekly-transaction-cleanup';
import { stockRoute } from '@/routes/stock.route';
import { transactionRoute } from './routes/transaction.route';
import { reportRoute } from './routes/report.route';
import { requestLogger } from './middlewares/logger';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Auth0 middleware
app.use(auth(authConfig));

app.use('/api/product', productRoute);
app.use('/api/branch', branchRoute);
app.use('/api/category', categoryRoute);
app.use('/api/stock', stockRoute);
app.use('/api/transaction', transactionRoute);
app.use('/api/report', reportRoute);
// app.use('/api/transaction', categoryRoute);

app.use(errorHandler);

scheduleWeeklyCleanup();

// Start server
(async () => {
  await checkDatabaseConnection(); // wait for DB connection
  app.listen(serverConfig.PORT, () => {
    logger.info(`Server running at http://localhost:${serverConfig.PORT}`);
  });
})();
