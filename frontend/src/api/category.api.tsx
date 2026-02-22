import { api } from "@/config/axios";
import type { CreateCategoryPayload } from "@/types/api/payload";
import type { CategoryResponse } from "@/types/api/response";
import type { ApiResponse } from "@/types/api/shared/api-response";

type UpdateCategoryArgs = {
  id: number;
  newData: {
    name: string;
  };
};

export const getCategories = async () => {
  const response =
    await api.get<ApiResponse<CategoryResponse[]>>("/api/category");
  return response.data.data;
};

export const createCategory = async (name: string) => {
  const response = await api.post<ApiResponse<CreateCategoryPayload>>(
    "/api/category",
    { name },
  );
  return response.data.data;
};

export const deleteCategory = async (id: number) => {
  const response = await api.delete<ApiResponse<CategoryResponse>>(
    `/api/category/${id}`,
  );
  return response.data.data;
};

export const updateCategory = async ({ newData, id }: UpdateCategoryArgs) => {
  const response = await api.put<ApiResponse<UpdateCategoryArgs>>(
    `/api/category/${id}`,
    newData,
  );
  return response.data.data;
};

export const getCategoryById = async (id: number) => {
  const response = await api.get<ApiResponse<CategoryResponse>>(
    `/api/category/${id}`,
  );
  return response.data.data;
};
