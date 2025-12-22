import { z } from 'zod';
import { Unit } from '@root/generated/prisma/enums';
import createError from 'http-errors';

const soldByTransformer = z
  .string()
  .min(1)
  .transform((val) => {
    const upper = val.toUpperCase();
    if (upper === 'KG') return Unit.KG;
    if (upper === 'PC') return Unit.PC;
    throw new createError.BadRequest('soldBy must be either "KG" or "PC"');
  });

export const CreateProductBody = z.object({
  name: z.string().min(1, 'Name is required'),
  costPerUnit: z.number().positive('Cost per unit must be positive'),
  soldBy: soldByTransformer,
  addedBy: z.number().int().positive('addedBy must be positive'),
  user: z.string().min(1, 'User is required'),
  categoryId: z.number().int().positive('categoryId must be positive'),
  branchId: z.number().int().positive('branchId must be positive'),
});

export const UpdateProductBody = CreateProductBody.partial();
