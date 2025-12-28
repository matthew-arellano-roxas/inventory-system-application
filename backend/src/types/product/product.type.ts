import { Unit } from '@models';

export type ProductDetail = SalesStockDetails & {
  categoryId: number;
  branchId: number;
  soldBy: Unit;
  name: string;
  id: number;
  costPerUnit: number;
  sellingPrice: number;
  addedBy: string;
  createdAt: Date;
};

export type SalesStockDetails = {
  stockSold: number;
  stock: number;
  monthSales: number;
};
