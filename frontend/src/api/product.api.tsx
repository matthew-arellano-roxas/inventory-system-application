import { api } from "@/config/axios";
import { cleanQuery } from "@/helpers/cleanQuery";
import type {
  CreateProductPayload,
  UpdateProductPayload,
} from "@/schemas/ProductSchema";
import type { Product, ProductSnippet } from "@/types/api/response";
import type { Unit } from "@/types/api/shared";
import type { ApiResponse } from "@/types/api/shared/api-response";

type ProductQuery = {
  page?: number;
  category?: number;
  branchId?: number;
  soldBy?: Unit;
  details?: boolean;
  search: string;
};

type UpdateProductArgs = {
  productId: number;
  data: Partial<Omit<UpdateProductPayload, "createdAt">>;
};

export const getProducts = async (query?: ProductQuery) => {
  let params;
  if (query) {
    params = cleanQuery(query);
  }
  const response = await api.get<ApiResponse<Product[]>>("/api/product", {
    params,
  });
  return response.data.data;
};

export const getProductSnippets = async (query?: ProductQuery) => {
  const response = await api.get<ApiResponse<ProductSnippet[]>>(
    "/api/product",
    {
      params: {
        ...query,
      },
    },
  );
  return response.data.data;
};

export const updateProduct = async (args: UpdateProductArgs) => {
  const response = await api.put<ApiResponse<UpdateProductPayload>>(
    `/api/product/${args.productId}`,
    args.data,
  );
  return response.data.data;
};

export const createProduct = async (
  data: Omit<Product, "createdAt" | "id">,
) => {
  const response = await api.post<ApiResponse<CreateProductPayload>>(
    "/api/product",
    data,
  );
  return response.data.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete<ApiResponse<Product>>(`/api/product/${id}`);
  return response.data.data;
};

export const getProductById = async (id: number) => {
  const response = await api.get<ApiResponse<Product>>(`/api/product/${id}`);
  return response.data.data;
};
