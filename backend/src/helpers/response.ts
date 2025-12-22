import { StatusCodes } from 'http-status-codes';
import { HttpError } from 'http-errors';

export type ApiResponse<T = unknown, M = unknown> = {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: Error | HttpError;
  meta?: M; // optional metadata
};

export function ok<T, M = unknown>(data: T, message = 'Success', meta?: M): ApiResponse<T, M> {
  return {
    success: true,
    status: StatusCodes.OK,
    message,
    data,
    ...(meta && { meta }), // include meta only if provided
  };
}

export function created<T, M = unknown>(data: T, message = 'Created', meta?: M): ApiResponse<T, M> {
  return {
    success: true,
    status: StatusCodes.CREATED,
    message,
    data,
    ...(meta && { meta }),
  };
}

// Usually used for asynchronous tasks
export function accepted<T, M = unknown>(
  data: T,
  message = 'Accepted',
  meta?: M,
): ApiResponse<T, M> {
  return {
    success: true,
    status: StatusCodes.ACCEPTED,
    message,
    data,
    ...(meta && { meta }),
  };
}

export const msg = {
  CREATE_SUCCESS: (resource: string) => `Successfully created ${resource}.`,
  READ_SUCCESS: (resource: string) => `Successfully retrieved ${resource}.`,
  UPDATE_SUCCESS: (resource: string) => `Successfully updated ${resource}.`,
  DELETE_SUCCESS: (resource: string) => `Successfully deleted ${resource}.`,
  CREATE_FAILED: (resource: string) => `Failed to create ${resource}.`,
  READ_FAILED: (resource: string) => `Failed to retrieve ${resource}.`,
  UPDATE_FAILED: (resource: string) => `Failed to update ${resource}.`,
  DELETE_FAILED: (resource: string) => `Failed to delete ${resource}.`,
} as const;
