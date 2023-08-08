import middy from "@middy/core";
import { z } from "zod";
import { MiddlewareRequest } from "../shared/types";

const surveyHookRequestBodySchema = z.object({
  responseId: z.string(),
  saveDb: z.boolean().optional(),
});

export type SurveyHookRequestBody = z.infer<typeof surveyHookRequestBodySchema>;

export const validateRequestBody =
  (): middy.MiddlewareFn => (request: MiddlewareRequest) => {
    try {
      request.event.parsedBody = surveyHookRequestBodySchema.parse(
        request.event.parsedBody
      );
    } catch (error) {
      throw new Error(`Request body cannot be validated: ${error}`);
    }
  };
