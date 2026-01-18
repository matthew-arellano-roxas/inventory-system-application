import { z } from 'zod';
import { TransactionType } from '@root/generated/prisma/enums'; // your enum

// Transaction Item schema
export const transactionItemSchema = z.object({
  productId: z.number().int().positive(), // must be a positive integer
  productName: z.string().min(1), // non-empty string
  quantity: z.number().positive(), // quantity > 0
});

// Transaction schema
export const transactionSchema = z.object({
  type: z.enum(TransactionType), // validates your Prisma enum
  branchId: z.number().int().positive(), // positive integer
  items: z.array(transactionItemSchema).min(1), // must have at least 1 item
});

// Type inference (optional, keeps TypeScript types in sync)
export type TransactionBody = z.infer<typeof transactionSchema>;
export type TransactionItemBody = z.infer<typeof transactionItemSchema>;
