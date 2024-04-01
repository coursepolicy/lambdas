import { z } from 'zod';

export const surveyHookRequestBodySchema = z.object({
  responseId: z.string(),
  organization: z.enum(['harvard']).optional(),
  saveDb: z.boolean().optional().default(true),
});

export type SurveyHookRequestBody = z.infer<typeof surveyHookRequestBodySchema>;
