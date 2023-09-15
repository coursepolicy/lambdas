import { z } from 'zod';

export const queryParams = z.object({
  publishId: z.string(),
});

export type QueryParamsSchema = z.infer<typeof queryParams>;
