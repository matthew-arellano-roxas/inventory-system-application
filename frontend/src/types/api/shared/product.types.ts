export const Unit = {
  KG: "KG",
  PC: "PC",
} as const;

export type Unit = (typeof Unit)[keyof typeof Unit];
