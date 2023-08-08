import middy from "@middy/core";
import { APIGatewayEvent } from "aws-lambda";
import { SurveyHookRequestBody } from "../../hook/schema";
import { SurveyResponsesRequestBody } from "../../responses/schema";

// omit body

export type ExtendedApiGateWayEvent = APIGatewayEvent & {
  parsedBody: SurveyHookRequestBody;
  parsedQueryParams: SurveyResponsesRequestBody;
};

export interface MiddlewareRequest
  extends middy.Request<ExtendedApiGateWayEvent> {}
