import 'dotenv/config';
import { longPolling } from './services/long-polling';
import { ExtendedApiGateWayEvent } from './utils/types';

// TODO - make this similar to update policy handler
export const getPolicyHandler = async ({
  queryStringParameters: { generatedId },
}: ExtendedApiGateWayEvent) => {
  try {
    const aiPolicy = await longPolling(generatedId);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: aiPolicy }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
