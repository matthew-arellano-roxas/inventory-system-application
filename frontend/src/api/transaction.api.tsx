import { api } from "@/config/axios";
import type { TransactionPayload } from "@/types/api/payload";
import type { TransactionResponse } from "@/types/api/response";
import type { ApiResponse } from "@/types/api/shared/api-response";

export const getTransactions = async () => {
  const response =
    await api.get<ApiResponse<TransactionResponse[]>>("/api/transaction");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};


export const createTransaction = async (data: TransactionPayload) => {
  const response =
    await api.post<ApiResponse<TransactionResponse>>("/api/transaction", data);
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const rollbackSaleTransaction = async (transactionId: number) => {
  const response = await api.post<ApiResponse<TransactionResponse>>(
    `/api/transaction/${transactionId}/rollback`,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
