import middy from '@middy/core';
import { MiddlewareRequest } from './types';
import { surveyresponsesRequestBodySchema } from './schema';

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
