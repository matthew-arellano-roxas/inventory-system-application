export const TransactionType = {
  SALE: "SALE",
  PURCHASE: "PURCHASE",
  RETURN: "RETURN",
  DAMAGE: "DAMAGE",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export type TransactionItemResponse = {
  productId: number;
  quantity: number;
  productName: string;
  discount: number;
};

export type TransactionResponse = {
  id: number;
  branchId: number;
  type: TransactionType;
  totalAmount: number;
  createdAt: string; // ISO date string from API
  transactionItem: TransactionItemResponse[];
};
