import 'dotenv/config';
import { ExtendedApiGateWayEvent } from './types';
import { longPolling } from './helpers';

export const responsesHandler = async ({
  queryStringParameters: { generatedId },
}: ExtendedApiGateWayEvent) => {
  try {
    return await longPolling(generatedId);
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
