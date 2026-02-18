  export type StockMovementResponse = {
    id: number;
    productId: number;
    movementType: "IN" | "OUT";
    movementReason: MovementReason;
    quantity: number;
    oldValue: number;
    newValue: number;
    createdAt: string; // ISO date from API
  };

  export const MovementType = {
    IN: "IN",
    OUT: "OUT",
  } as const;

  export const MovementReason = {
    SALE: "SALE",
    DAMAGE: "DAMAGE",
    RETURN: "RETURN",
    PURCHASE: "PURCHASE",
  } as const;

  export type MovementReason =
    (typeof MovementReason)[keyof typeof MovementReason];

  export type MovementType = (typeof MovementType)[keyof typeof MovementType];
