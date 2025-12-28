export interface TransactionDetailPayload {
  productId: number;
  branchId: number;
  stockSold: number;
  payment: number;
}

export interface TransactionPayload {
  details: TransactionDetailPayload[];
}
