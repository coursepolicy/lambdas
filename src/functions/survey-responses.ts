import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from "@middy/http-event-normalizer";
import errorLogger from "@middy/error-logger";
import httpSecurityHeaders from "@middy/http-security-headers";

import {
  surveyResponseHandler,
  validateRequestBody,
} from "../survey-responses";

export const handler = middy(surveyResponseHandler)
  .before(validateRequestBody())
  .use(httpEventNormalizer())
  .use(errorLogger())
  .use(httpErrorHandler())
  .use(httpSecurityHeaders());
