import type { Unit } from "@/types/api/shared";

export type Product = {
  id?: number;
  branchId: number;
  categoryId: number;
  name: string;
  costPerUnit: number;
  soldBy: Unit;
  sellingPrice: number;
  addedBy: string;
  createdAt?: string;
};

export type ProductSnippet = {
  id: number;
  name: string;
};