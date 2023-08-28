import { ExtendedApiGateWayEvent } from './utils/types';
import { updatePolicy } from './services/update-policy';

export const updatePolicyHandler = async ({
  queryStringParameters: { id },
  parsedBody: { policy },
}: ExtendedApiGateWayEvent) => {
  try {
    const [updatedPolicy] = await updatePolicy(id, policy);
    const { results } = updatedPolicy;

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
