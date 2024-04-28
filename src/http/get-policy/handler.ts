import 'dotenv/config';
import { longPolling } from './services/long-polling';
import { ExtendedApiGateWayEvent } from './utils/types';

// TODO - make this similar to update policy handler
export const getPolicyHandler = async (event: ExtendedApiGateWayEvent) => {
  console.info('getPolicyHandler Event', { event });
  const {
    queryStringParameters: { generatedId },
  } = event;
  try {
    const aiPolicy = await longPolling(generatedId);

    if (!aiPolicy) {
      const errorMessage =
        'Timeout Exceeded! Failure to find the record. Please complete the survey and try again';
      console.error(errorMessage);
      return {
        statusCode: 408,
        body: JSON.stringify({
          message: errorMessage,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data: aiPolicy }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
