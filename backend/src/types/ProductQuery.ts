import { Unit } from '@root/generated/prisma/enums';
export type ProductQueryOptions = {
  page: number;
  categoryId?: number;
  branchId?: number;
  soldBy?: Unit;
  search?: string;
  details: boolean;
};
