import { z } from 'zod';

// Create stock body
export const CreateStockBody = z.object({
  productId: z
    .number()
    .int()
    .refine((val) => val > 0, {
      message: 'Product ID is required and must be a positive integer',
    }),
  quantity: z.number().refine((val) => val > 0, {
    message: 'Quantity must be greater than 0',
  }),
});

// Update stock body
export const UpdateStockBody = z.object({
  quantity: z
    .number()
    .refine((val) => val > 0, {
      message: 'Quantity must be greater than 0',
    })
    .optional(),
});
