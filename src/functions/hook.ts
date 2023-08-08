import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import httpEventNormalizer from "@middy/http-event-normalizer";
import errorLogger from "@middy/error-logger";
import httpSecurityHeaders from "@middy/http-security-headers";

import { surveyHookHandler, validateRequestBody } from "../hook";
import { parseJsonBody } from "../shared/utilities/middlewares";

export const handler = middy(surveyHookHandler)
  .before(parseJsonBody())
  .before(validateRequestBody())
  .use(httpEventNormalizer())
  .use(errorLogger())
  .use(httpErrorHandler())
  .use(httpSecurityHeaders());
