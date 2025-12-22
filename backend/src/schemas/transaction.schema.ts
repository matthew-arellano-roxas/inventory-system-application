import { z } from 'zod';

// Transaction detail item
export const TransactionDetailItem = z.object({
  productId: z
    .number()
    .int()
    .refine((val) => val > 0, {
      message: 'Product ID must be a positive integer',
    }),
  branchId: z
    .number()
    .int()
    .refine((val) => val > 0, {
      message: 'Branch ID must be a positive integer',
    }),
  stockSold: z.number().refine((val) => val > 0, {
    message: 'Stock sold must be greater than 0',
  }),
  payment: z.number().refine((val) => val >= 0, {
    message: 'Payment must be 0 or greater',
  }),
});

// Create transaction
export const CreateTransactionBody = z.object({
  details: z.array(TransactionDetailItem).nonempty('Transaction must include at least one item'),
});

// Update transaction
export const UpdateTransactionBody = z.object({
  details: z.array(TransactionDetailItem).nonempty('Transaction must include at least one item'),
});
