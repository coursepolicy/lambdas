import middy from "@middy/core";
import { z } from "zod";
import { MiddlewareRequest } from "../shared/types";

const surveyresponsesRequestBodySchema = z.object({
  generatedId: z.string(),
});

export type SurveyResponsesRequestBody = z.infer<
  typeof surveyresponsesRequestBodySchema
>;

export const validateRequestBody =
  (): middy.MiddlewareFn => (request: MiddlewareRequest) => {
    try {
      request.event.parsedQueryParams = surveyresponsesRequestBodySchema.parse(
        request.event.queryStringParameters
      );
    } catch (error) {
      throw new Error(`Request body cannot be validated: ${error}`);
    }
  };
