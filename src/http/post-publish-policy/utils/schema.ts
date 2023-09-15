import { z } from 'zod';
import { policySections } from '../../../shared';

export const requestBodySchema = z.object({
  publishId: z.string(),
  policyId: z.string(),
  aiPolicy: z.object({
    heading: z.string(),
    sections: policySections,
  }),
});

export type RequestBody = z.infer<typeof requestBodySchema>;
