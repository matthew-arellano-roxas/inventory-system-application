import { api } from "@/config/axios";
import type { ExpensePayload } from "@/types/api/payload";
import type { ExpenseResponse } from "@/types/api/response/opex.reponse";
import type { ApiResponse } from "@/types/api/shared/api-response";

export const getOpexList = async () => {
  const response =
    await api.get<ApiResponse<ExpenseResponse[]>>("/api/expenses");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const createOpex = async (data: ExpensePayload) => {
  const response = await api.post<ApiResponse<ExpenseResponse>>(
    "/api/expenses",
    data,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const deleteOpex = async (id: number) => {
  const response = await api.delete<ApiResponse<ExpenseResponse>>(
    `/api/expenses/${id}`,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
