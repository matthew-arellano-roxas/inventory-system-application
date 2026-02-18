import * as z from "zod";

// Assuming Unit is a string union or enum
export const CreateProductSchema = z.object({
  name: z.string().min(2, "Name is required"),
  costPerUnit: z.coerce.number().min(0, "Cost must be 0 or more"),
  soldBy: z.string().min(1, "Select a unit"),
  sellingPrice: z.coerce.number().min(0, "Price must be 0 or more"),
  addedBy: z.string().min(1),
  categoryId: z.coerce.number().min(1, "Select a category"),
  branchId: z.coerce.number().min(1, "Select a branch"),
});

export type CreateProductFormValues = z.infer<typeof CreateProductSchema>;
