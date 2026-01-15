import { TransactionType } from '@models';

export type TransactionPayload = {
  type: TransactionType;
  branchId: number;
  items: TransactionItemPayload[];
};

export type TransactionItemPayload = {
  productId: number;
  productName: string;
  quantity: number;
};
