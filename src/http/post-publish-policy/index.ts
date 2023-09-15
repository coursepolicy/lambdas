import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer';
import errorLogger from '@middy/error-logger';
import cors from '@middy/http-cors';
import httpSecurityHeaders from '@middy/http-security-headers';

import { postPublishPolicyHandler } from './handler';
import { parseJsonBody, validateRequestBody } from './utils/middlewares';

// POST /publish-policy
export const handler = middy(postPublishPolicyHandler)
  .before(parseJsonBody())
  .before(validateRequestBody())
  .use(httpEventNormalizer())
  .use(errorLogger())
  .use(httpErrorHandler())
  .use(cors())
  .use(httpSecurityHeaders());
