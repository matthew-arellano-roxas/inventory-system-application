import { z } from 'zod';
import { Unit } from '@root/generated/prisma/enums';

export const CreateProductBody = z.object({
  name: z.string().min(1, 'Name is required'),
  costPerUnit: z.number().positive('Cost per unit must be positive'),
  soldBy: z.enum(Unit),
  sellingPrice: z.number().positive('selling price must be positive'),
  addedBy: z.string().min(1, 'User is required'),
  categoryId: z.number().int().positive('categoryId must be positive'),
  branchId: z.number().int().positive('branchId must be positive'),
});

export const GetProductQuery = z.object({
  page: z.coerce.number().default(1),
  categoryId: z.coerce.number().optional(),
  branchId: z.coerce.number().optional(),
  search: z.string().optional(),
  details: z.preprocess((val) => val === 'true', z.boolean().default(false)),
  soldBy: z.enum(Unit).optional(),
});

export type GetProductQuery = z.infer<typeof GetProductQuery>;

export const UpdateProductBody = CreateProductBody.partial();
