import { z } from 'zod';

export const updatePolicyRequestQueryParamSchema = z.object({
  id: z.string(),
});

export const updatePolicyRequestBodySchema = z.object({
  policy: z.string(),
});

export type UpdatePolicyRequestQueryParam = z.infer<
  typeof updatePolicyRequestQueryParamSchema
>;

export type UpdatePolicyRequestBodySchema = z.infer<
  typeof updatePolicyRequestBodySchema
>;
