import { z } from 'zod';

export const GetOpexQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  branchId: z.coerce.number().int().positive().optional(),
});

export type GetOpexQueryType = z.infer<typeof GetOpexQuery>;

export const CreateOpexBody = z.object({
  branchId: z.coerce.number().int().positive(),
  name: z.string().trim().min(1),
  amount: z.coerce.number().finite(),
});

export type CreateOpexBodyType = z.infer<typeof CreateOpexBody>;

export const DeleteOpexParams = z.object({
  id: z.coerce.number().int().positive(),
});

export type DeleteOpexParamsType = z.infer<typeof DeleteOpexParams>;
