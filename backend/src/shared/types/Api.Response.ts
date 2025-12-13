import { HttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';

export type ApiResponse<T = unknown> = {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: Error | HttpError;
};

export function ok<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    success: true,
    status: StatusCodes.OK,
    message,
    data,
  };
}

export function created<T>(data: T, message = 'Created'): ApiResponse<T> {
  return {
    success: true,
    status: StatusCodes.CREATED,
    message,
    data,
  };
}

