import createError, { HttpError } from 'http-errors';
import { logger } from '@/config';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '@/types';

const errorHandler = (err: Error | HttpError, req: Request, res: Response, _next: NextFunction) => {
  let httpError: HttpError;

  // Convert normal Error to HttpError if needed
  if (createError.isHttpError(err)) {
    httpError = err;
  } else {
    httpError = createError(500, err.message || 'Internal Server Error');
  }

  const statusCode = httpError.status || 500;
  const message = httpError.message || 'Something went wrong';

  // Log the error
  logger.error(`[${new Date().toISOString()}] Error:`, httpError);

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  } as ApiResponse);
};

export default errorHandler;
