import { logger } from '@/config';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '@/helpers/response';
import ErrorValidator from '@/helpers/ErrorValidator';
import { formatZodError } from '@/helpers/formatZodError';
import { clearResourceCache } from '@/middlewares';

const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message: string | string[] = 'Something went wrong';

  if (ErrorValidator.isZodError(err)) {
    statusCode = 400;
    message = formatZodError(err);
  } else if (ErrorValidator.isHttpError(err)) {
    statusCode = err.status || 500;
    message = err.message;
  } else if (err instanceof Error && err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Access denied. Insufficient permissions.';
  } else if (ErrorValidator.isPrismaError(err)) {
    // Intentionally opaque response
    statusCode = 500;
    message = 'Internal Server Error';
  }

  logger.error(`[${new Date().toISOString()}]`, err);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    error: err,
  } as ApiResponse);

  clearResourceCache(req.originalUrl);
};

export { errorHandler };
