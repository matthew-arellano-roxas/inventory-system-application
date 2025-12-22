import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, z } from 'zod';
import { StatusCodes } from 'http-status-codes';

// Validate request body
export function validateBody<T extends ZodTypeAny>(schema: T) {
  return (req: Request<unknown, unknown, z.infer<T>>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        StatusCodes: StatusCodes.BAD_REQUEST,
        errors,
      });
    }
    req.body = result.data;
    next();
  };
}

// Validate path parameters
export function validateParams<T extends ZodTypeAny>(schema: T) {
  return (req: Request<z.infer<T>>, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }
    req.params = result.data;
    next();
  };
}
