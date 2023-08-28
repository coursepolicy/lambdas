import { ExtendedApiGateWayEvent } from './utils/types';
import { updatePolicy } from './services/update-policy';

export const responsesHandler = async ({
  queryStringParameters: { id },
  parsedBody: { policy },
}: ExtendedApiGateWayEvent) => {
  try {
    const updated = await updatePolicy(id, policy);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: updated }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
