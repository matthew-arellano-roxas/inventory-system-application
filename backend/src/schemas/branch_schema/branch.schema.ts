import { z } from 'zod';

export const branchSchema = z.object({
  branchName: z.string().min(2, 'Branch name must be at least 2 characters'),
  branchLocation: z.string().min(2, 'Branch location must be at least 2 characters'),
});

export type BranchInput = z.infer<typeof branchSchema>;

export const updateBranchSchema = branchSchema.partial();

export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;
