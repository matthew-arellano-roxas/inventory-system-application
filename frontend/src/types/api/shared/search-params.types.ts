import type { Unit } from "./product.types";

export type ProductQuery = {
  page?: number | null;
  categoryId?: number | null;
  branchId?: number | null;
  soldBy?: Unit | null;
  details?: boolean | null;
  search?: string | null;
};
