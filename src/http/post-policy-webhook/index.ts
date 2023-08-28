import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import errorLogger from '@middy/error-logger';
import cors from '@middy/http-cors';
import httpSecurityHeaders from '@middy/http-security-headers';

import { surveyHookHandler } from './handler';
import { parseJsonBody, validateRequestBody } from './utils/middlewares';

// POST /hook
export const handler = middy(surveyHookHandler)
  .before(parseJsonBody())
  .before(validateRequestBody())
  .use(httpEventNormalizer())
  .use(errorLogger())
  .use(httpErrorHandler())
  .use(cors())
  .use(httpSecurityHeaders());
