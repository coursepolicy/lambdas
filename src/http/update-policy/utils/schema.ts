import { z } from 'zod';
import { policySections } from '../../../shared';

export const updatePolicyRequestQueryParamSchema = z.object({
  id: z.string(),
  generatedId: z.string().optional(),
});

export const updatePolicyRequestBodySchema = z.object({
  policy: z.object({
    heading: z.string(),
    sections: policySections,
  }),
});

export type UpdatePolicyRequestQueryParam = z.infer<
  typeof updatePolicyRequestQueryParamSchema
>;

export type UpdatePolicyRequestBodySchema = z.infer<
  typeof updatePolicyRequestBodySchema
>;
