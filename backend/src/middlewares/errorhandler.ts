import createError, { HttpError } from 'http-errors';
import { logger } from '@/config';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '@/helpers/response';
import { ZodError } from 'zod';

const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  let statusCode: number;
  let message: string | string[];

  if (err instanceof ZodError) {
    statusCode = 400;
    // Use err.issues directly, fully typed and not deprecated
    message = err.issues.map((issue) => `${issue.path.join('.')} - ${issue.message}`);
  } else {
    const httpError: HttpError = createError.isHttpError(err)
      ? (err as HttpError)
      : createError(500, (err as Error).message || 'Internal Server Error');

    statusCode = httpError.status || 500;
    message = httpError.message || 'Something went wrong';
  }

  logger.error(`[${new Date().toISOString()}] Error:`, err);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  } as ApiResponse);
};

export default errorHandler;
