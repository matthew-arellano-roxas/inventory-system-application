import { type TransactionResponse } from "@/types/api/response/transaction.response";
export const MOCK_TRANSACTIONS: TransactionResponse[] = [
  {
    id: 1024,
    branchId: 1,
    type: "SALE",
    totalAmount: 1250.5,
    createdAt: "2026-02-15T08:30:00Z",
    transactionItem: [
      { productId: 1, productName: "Arabica Coffee Beans (500g)", quantity: 2 },
      { productId: 5, productName: "Paper Cups - Medium", quantity: 50 },
      { productId: 12, productName: "Caramel Syrup", quantity: 1 },
    ],
  },
  {
    id: 1025,
    branchId: 1,
    type: "PURCHASE",
    totalAmount: 5400.0,
    createdAt: "2026-02-15T09:15:00Z",
    transactionItem: [
      { productId: 20, productName: "Whole Milk - Case", quantity: 10 },
      { productId: 21, productName: "Oat Milk - Case", quantity: 5 },
    ],
  },
  {
    id: 1026,
    branchId: 2,
    type: "DAMAGE",
    totalAmount: 450.0,
    createdAt: "2026-02-14T16:45:00Z",
    transactionItem: [
      { productId: 8, productName: "Ceramic Mug - White", quantity: 3 },
    ],
  },
  {
    id: 1027,
    branchId: 1,
    type: "SALE",
    totalAmount: 320.75,
    createdAt: "2026-02-15T10:05:00Z",
    transactionItem: [
      { productId: 3, productName: "Espresso Shot", quantity: 4 },
      { productId: 4, productName: "Croissant", quantity: 2 },
      { productId: 15, productName: "Sugar Sachet", quantity: 100 },
      { productId: 18, productName: "Stirrer Stick", quantity: 50 },
      { productId: 9, productName: "Napkins - Pack", quantity: 1 },
    ],
  },
  {
    id: 1028,
    branchId: 1,
    type: "RETURN",
    totalAmount: 120.0,
    createdAt: "2026-02-15T11:20:00Z",
    transactionItem: [
      { productId: 10, productName: "Bottled Water (500ml)", quantity: 5 },
    ],
  },
];
