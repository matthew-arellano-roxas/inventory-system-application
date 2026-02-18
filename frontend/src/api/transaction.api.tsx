import { api } from "@/config/axios";
import type { TransactionResponse } from "@/types/api/response";
import type { ApiResponse } from "@/types/api/shared/api-response";

export const getTransactions = async () => {
  const response =
    await api.get<ApiResponse<TransactionResponse[]>>("/api/transaction");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
