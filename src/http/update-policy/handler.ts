import { ExtendedApiGateWayEvent } from './utils/types';
import { updatePolicy } from './services';

export const updatePolicyHandler = async (event: ExtendedApiGateWayEvent) => {
  console.info('updatePolicyHandler Event', { event })
  
  const {
    queryStringParameters: { id, generatedId },
    parsedBody: { policy },
  } = event;
  try {
    const updated = await updatePolicy(id, policy, generatedId);

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
