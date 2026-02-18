import type { Unit } from "@/types/api/shared";

export interface CreateProductPayload {
  name: string;
  costPerUnit: number;
  soldBy: Unit;
  sellingPrice: number;
  addedBy: string;
  categoryId: number;
  branchId: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

