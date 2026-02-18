import { api } from "@/config/axios";
import type { BranchResponse } from "@/types/api/response";
import type { ApiResponse } from "@/types/api/shared/api-response";
import { toast } from "sonner";

export type UpdateBranchParams = { id: number; name: string };

export const getBranches = async () => {
  const response = await api.get<ApiResponse<BranchResponse[]>>("/api/branch");
  if (!response.data.success) toast.error(response.data.message);
  return response.data.data;
};

export const deleteBranch = async (id: number) => {
  const response = await api.delete(`/api/branch/${id}`);
  if (!response.data.success) toast.error(response.data.message);
  toast.success("Branch deleted successfully");
  return response.data.data;
};

export const createBranch = async (name: string) => {
  const response = await api.post("/api/branch", {
    name,
  });
  if (!response.data.success) toast.error(response.data.message);
  toast.success("Branch created successfully");
  return response.data.data;
};

export const updateBranch = async ({ id, name }: UpdateBranchParams) => {
  const response = await api.put(`/api/branch/${id}`, {
    name,
  });
  if (!response.data.success) toast.error(response.data.message);
  toast.success("Branch updated successfully");
  return response.data.data;
};
