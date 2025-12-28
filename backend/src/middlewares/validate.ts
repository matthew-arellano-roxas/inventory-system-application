import { Request, Response, NextFunction } from 'express';
import { ZodType, z } from 'zod';
import { StatusCodes } from 'http-status-codes';

// Validate request body
export function validateBody<T extends ZodType>(schema: T) {
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

export function validateQuery<T extends ZodType>(schema: T) {
  return (
    // Express Request Generics: Request<Params, ResBody, ReqBody, ReqQuery>
    req: Request<unknown, unknown, unknown, z.infer<T>>,
    res: Response,
    next: NextFunction,
  ) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Query validation failed',
        statusCode: StatusCodes.BAD_REQUEST,
        errors,
      });
    }

    // result.data contains the successfully parsed and coerced values
    req.query = result.data;
    next();
  };
}

// Validate path parameters
export function validateParams<T extends ZodType>(schema: T) {
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
