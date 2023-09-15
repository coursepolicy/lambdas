import middy from '@middy/core';

import { APIGatewayEvent } from 'aws-lambda';
import { QueryParamsSchema } from './schema';

export type ExtendedApiGateWayEvent = Omit<
  APIGatewayEvent,
  'queryStringParameters'
> & {
  queryStringParameters: QueryParamsSchema;
};

export interface MiddlewareRequest
  extends middy.Request<ExtendedApiGateWayEvent> {}
