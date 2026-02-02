import { Transaction, TransactionType } from '@models';

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

export interface TransactionProcess {
  makeTransaction(payload: TransactionPayload): Promise<Transaction>;
}
