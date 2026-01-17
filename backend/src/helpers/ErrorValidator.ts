import { Prisma } from '@root/generated/prisma/client';
import createHttpError from 'http-errors';
import { ZodError } from 'zod';

export class ErrorValidator {
  static isZodError(error: unknown) {
    return error instanceof ZodError;
  }

  static isHttpError(error: unknown) {
    return createHttpError.isHttpError(error);
  }

  static isPrismaError(error: unknown) {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError ||
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientValidationError
    );
  }
}

export default ErrorValidator;
