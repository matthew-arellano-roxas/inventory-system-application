import { z } from 'zod';
import { Unit } from '@root/generated/prisma/enums'; // Use your Prisma enum

// Create Product Body
export const CreateProductBody = z.object({
  name: z.string().min(1, 'Name is required'),
  costPerUnit: z.number().positive('Cost per unit must be positive'),
  soldBy: z.nativeEnum(Unit),
  addedBy: z.number().int().positive('addedBy must be a positive integer'),
  user: z.string().min(1, 'User is required'),
  categoryId: z.number().int().positive('categoryId must be a positive integer'),
  branchId: z.number().int().positive('branchId must be a positive integer'),
});

// Update Product Body
export const UpdateProductBody = CreateProductBody.partial(); // all fields optional
