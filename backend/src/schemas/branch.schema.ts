import { z } from 'zod';

export const CreateBranchBody = z.object({
  name: z.string().min(1, 'Branch name is required'),
});

export const UpdateBranchBody = z.object({
  name: z.string().min(1, 'Branch name is required').optional(),
});
