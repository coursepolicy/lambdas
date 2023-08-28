import { z } from 'zod';

export const surveyresponsesRequestBodySchema = z.object({
  generatedId: z.string(),
});

export type SurveyResponsesRequestBody = z.infer<
  typeof surveyresponsesRequestBodySchema
>;
