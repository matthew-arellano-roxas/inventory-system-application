import createError from 'http-errors';
import { Prisma } from '@root/generated/prisma/client';
import { logger } from '@/config';
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '@/helpers/response';
import { ZodError } from 'zod';

const errorHandler = (err: unknown, req: Request, res: Response, _next: NextFunction) => {
  let statusCode = 500;
  let message: string | string[] = 'Something went wrong';

  if (err instanceof ZodError) {
    statusCode = 400;
    message = err.issues.map((issue) => `${issue.path.join('.')} - ${issue.message}`);
  } else if (createError.isHttpError(err)) {
    statusCode = err.status || 500;
    message = err.message;
  } else if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    // Intentionally opaque response
    statusCode = 500;
    message = 'Something went wrong';
  }

  logger.error(`[${new Date().toISOString()}]`, err);

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
  } as ApiResponse);
};

export default errorHandler;
