import { Unit } from '@models';
import { Product } from '@models';

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
  monthsRevenue: number;
};
export type ProductQueryOptions = {
  page: number;
  categoryId?: number;
  branchId?: number;
  soldBy?: Unit;
  search?: string;
  details: boolean;
};

export type ProductPriceInfo = Pick<Product, 'sellingPrice' | 'costPerUnit' | 'name'>;
