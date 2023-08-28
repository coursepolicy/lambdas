import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import errorLogger from '@middy/error-logger';
import cors from '@middy/http-cors';
import httpSecurityHeaders from '@middy/http-security-headers';
import { responsesHandler } from './handler';
import { validateQueryParameters } from './utils/middlewares';

// GET /policy
export const handler = middy(responsesHandler)
  .before(validateQueryParameters())
  .use(httpEventNormalizer())
  .use(errorLogger())
  .use(httpErrorHandler())
  .use(cors())
  .use(httpSecurityHeaders());
