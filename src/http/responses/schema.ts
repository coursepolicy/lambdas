import middy from '@middy/core';
import { z } from 'zod';
import { MiddlewareRequest } from './types';

const surveyresponsesRequestBodySchema = z.object({
  generatedId: z.string(),
});

export type SurveyResponsesRequestBody = z.infer<
  typeof surveyresponsesRequestBodySchema
>;

export const validateRequestBody =
  (): middy.MiddlewareFn => (request: MiddlewareRequest) => {
    if (!request.event.queryStringParameters) {
      throw new Error('query params is empty');
    }
    try {
      request.event.queryStringParameters =
        surveyresponsesRequestBodySchema.parse(
          request.event.queryStringParameters
        );
    } catch (error) {
      throw new Error(`Request body cannot be validated: ${error}`);
    }
  };
