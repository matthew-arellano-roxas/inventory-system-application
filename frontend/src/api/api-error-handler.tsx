import type { ApiResponse } from "@/types/api/shared/api-response";
import type { AxiosError } from "axios";
import { toast } from "sonner";

export type ParsedApiError = {
  status?: number;
  message: string;
  raw: unknown;
};

export function parseApiError(err: unknown): ParsedApiError {
  const fallback = "Request failed";

  // Axios error
  const axiosErr = err as AxiosError<ApiResponse>;
  const body = axiosErr?.response?.data;

  const message =
    body?.message ??
    body?.error?.message ??
    axiosErr?.message ??
    (err instanceof Error ? err.message : undefined) ??
    fallback;

  return {
    status: body?.status ?? axiosErr?.response?.status,
    message,
    raw: err,
  };
}

export function toastApiError(err: unknown): void {
  const { status, message } = parseApiError(err);

  if (status === 409) {
    toast.warning(message);
    return;
  }

  toast.error(message);
}
