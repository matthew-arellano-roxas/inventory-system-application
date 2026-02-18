export type TransactionItemPayload = {
  productId: number;
  productName: string;
  quantity: number;
};

export type TransactionPayload = {
  type: TransactionType;
  branchId: number;
  items: TransactionItemPayload[];
};

export const TransactionType = {
  SALE: "SALE",
  PURCHASE: "PURCHASE",
  RETURN: "RETURN",
  DAMAGE: "DAMAGE",
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];
