import middy from '@middy/core';
import { APIGatewayEvent } from 'aws-lambda';
import { SurveyResponsesRequestBody } from './schema';

// omit body

export type ExtendedApiGateWayEvent = Omit<
  APIGatewayEvent,
  'queryStringParameters'
> & {
  queryStringParameters: SurveyResponsesRequestBody;
};

export interface MiddlewareRequest
  extends middy.Request<ExtendedApiGateWayEvent> {}