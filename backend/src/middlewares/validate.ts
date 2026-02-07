import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';
import { StatusCodes } from 'http-status-codes';

// Validate request body
export function validateBody<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        status: StatusCodes.BAD_REQUEST,
        error: errors,
      });
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Query validation failed',
        status: StatusCodes.BAD_REQUEST,
        error: errors,
      });
    }

    Object.assign(req.query, result.data);
    next();
  };
}

export function validateParams<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Params validation failed',
        status: StatusCodes.BAD_REQUEST,
        error: errors,
      });
    }

    Object.assign(req.params, result.data);
    next();
  };
}
