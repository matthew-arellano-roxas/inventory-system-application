import { api } from "@/config/axios";
import type { StockMovementResponse } from "@/types/api/response";
import type { ApiResponse } from "@/types/api/shared/api-response";

export const getStockByProductId = async (productId: number) => {
  const response = await api.get<ApiResponse<StockMovementResponse>>(
    `/api/stock/${productId}`,
  );
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

export const getStockMovementList = async () => {
  const response =
    await api.get<ApiResponse<StockMovementResponse[]>>("/api/stock");
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};
