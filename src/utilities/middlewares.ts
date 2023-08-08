import middy from "@middy/core";
import { MiddlewareRequest } from "../types";

export const parseJsonBody =
  (): middy.MiddlewareFn => (request: MiddlewareRequest) => {
    if (request.event.body)
      request.event.parsedBody = JSON.parse(request.event.body);
  };
