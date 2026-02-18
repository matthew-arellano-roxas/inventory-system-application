import type { StockMovementResponse } from "@/types/api/response/stock.response";

export const MOCK_STOCK_MOVEMENTS: StockMovementResponse[] = [
  {
    id: 1,
    productId: 101,
    movementType: "IN",
    movementReason: "PURCHASE",
    quantity: 50,
    oldValue: 10,
    newValue: 60,
    createdAt: "2026-02-15T10:00:00Z",
  },
  {
    id: 2,
    productId: 101,
    movementType: "OUT",
    movementReason: "SALE",
    quantity: 5,
    oldValue: 60,
    newValue: 55,
    createdAt: "2026-02-15T14:30:00Z",
  },
  {
    id: 3,
    productId: 105,
    movementType: "OUT",
    movementReason: "DAMAGE",
    quantity: 2,
    oldValue: 15,
    newValue: 13,
    createdAt: "2026-02-15T16:00:00Z",
  },
];


