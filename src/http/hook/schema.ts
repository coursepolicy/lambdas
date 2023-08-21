import { z } from 'zod';

export const surveyHookRequestBodySchema = z.object({
  responseId: z.string(),
  saveDb: z.boolean().optional(),
});

export type SurveyHookRequestBody = z.infer<typeof surveyHookRequestBodySchema>;
