import { z } from "zod";
import { Unit } from "@/types/api/shared";

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  costPerUnit: z
    .number("Expecting a number")
    .positive("Cost must be greater than 0"),
  soldBy: z.nativeEnum(Unit),
  sellingPrice: z
    .number("Expecting a number")
    .positive("Selling price must be greater than 0"),
  categoryId: z
    .number("Expecting a number")
    .int()
    .positive("Category is required"),
  branchId: z.number("Expecting number").int().positive("Branch is required"),
});

export type CreateProductPayload = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductPayload = z.infer<typeof updateProductSchema>;
