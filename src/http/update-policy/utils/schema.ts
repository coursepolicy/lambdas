import { z } from 'zod';

export const updatePolicyRequestQueryParamSchema = z.object({
  id: z.string(),
  generatedId: z.string().optional(),
});

export const updatePolicyRequestBodySchema = z.object({
  policy: z.object({
    header: z.string(),
    content: z.array(
      z.object({
        id: z.string(),
        sectionTitle: z.string(),
        subSections: z.array(
          z.object({
            id: z.string(),
            subSectionTitle: z.string(),
            content: z.string().or(z.array(z.string())),
            miscData: z.record(z.any()).optional(),
          })
        ),
      })
    ),
  }),
});

export type UpdatePolicyRequestQueryParam = z.infer<
  typeof updatePolicyRequestQueryParamSchema
>;

export type UpdatePolicyRequestBodySchema = z.infer<
  typeof updatePolicyRequestBodySchema
>;
