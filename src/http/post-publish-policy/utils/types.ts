import { APIGatewayEvent } from 'aws-lambda';
import { RequestBody } from './schema';
import middy from '@middy/core';

export type ExtendedApiGateWayEvent = APIGatewayEvent & {
  parsedBody: RequestBody;
};

export interface MiddlewareRequest
  extends middy.Request<ExtendedApiGateWayEvent> {}
