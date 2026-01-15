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
  monthSales: number;
};

export type ProductPriceInfo = Pick<Product, 'sellingPrice' | 'costPerUnit' | 'name'>;
