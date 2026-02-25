import { api } from "@/config/axios";
import type { ExpensePayload } from "@/types/api/payload";
import type { ExpenseResponse } from "@/types/api/response/opex.reponse";
import type { ApiResponse } from "@/types/api/shared/api-response";

export const getOpexList = async () => {
  const response = await api.get<ApiResponse<ExpenseResponse[]>>("/api/opex");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const createOpex = async (data: ExpenseResponse) => {
  const response = await api.post<ApiResponse<ExpensePayload>>(
    "/api/opex",
    data,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const deleteOpex = async (id: number) => {
  const response = await api.delete<ApiResponse<ExpenseResponse>>(
    `/api/opex/${id}`,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
