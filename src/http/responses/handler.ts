import 'dotenv/config';
import { longPolling } from './long-polling';
import { ExtendedApiGateWayEvent } from './types';

// TODO - make this similar to update policy handler
export const responsesHandler = async ({
  queryStringParameters: { generatedId },
}: ExtendedApiGateWayEvent) => {
  try {
    const { results } = await longPolling(generatedId);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: results }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
