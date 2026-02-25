// @/api/report.api.ts
import { api } from "@/config/axios";
import { cleanQuery } from "@/helpers/cleanQuery";
import {
  type BranchReportResponse,
  type CurrentMonthReportResponse,
  type MonthlyReportResponse,
  type ProductReportQuery,
  type ProductReportResponse,
} from "@/types/api/response";
import { type ApiResponse } from "@/types/api/shared/api-response";

export const getCurrentMonthData = async () => {
  // We remove the .catch here so the Router can handle the error via errorElement
  const response = await api.get<ApiResponse<CurrentMonthReportResponse>>(
    "/api/report/current-month",
  );
  return response.data.data;
};

export const getMonthlyReport = async () => {
  // We remove the .catch here so the Router can handle the error via errorElement
  const response = await api.get<ApiResponse<MonthlyReportResponse[]>>(
    "/api/report/monthly",
  );
  return response.data.data;
};

export const getBranchReport = async () => {
  // We remove the .catch here so the Router can handle the error via errorElement
  const response =
    await api.get<ApiResponse<BranchReportResponse[]>>("/api/report/branch");
  return response.data.data;
};

export const getProductReport = async (query?: ProductReportQuery) => {
  const response = await api.get<ApiResponse<ProductReportResponse[]>>(
    "/api/report/product",
    {
      params: query ? cleanQuery(query) : undefined,
    },
  );
  return response.data.data;
};

export const getProductReportById = async (id: number) => {
  // We remove the .catch here so the Router can handle the error via errorElement
  const response = await api.get<ApiResponse<ProductReportResponse>>(
    `/api/report/product/${id}`,
  );
  return response.data.data;
};
