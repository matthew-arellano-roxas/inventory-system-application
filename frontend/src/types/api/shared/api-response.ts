export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type ApiResponse<T = unknown, M = unknown> = {
  success: boolean;
  status: number;
  message: string;
  data?: T;
  error?: Error;
  meta?: M; // optional metadata
};
