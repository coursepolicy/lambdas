import 'dotenv/config';
import { ExtendedApiGateWayEvent } from './utils/types';
import { db } from '../../../data';

export const getPolicyHandler = async (event: ExtendedApiGateWayEvent) => {
  console.info('getPolicyHandler Event', JSON.stringify(event, null, 2));
  const {
    queryStringParameters: { publishId },
  } = event;
  try {
    const aiPolicy = await db('publish_policies')
      .where({ id: publishId })
      .first();

    if (!aiPolicy) {
      const errorMessage = 'DB failure';
      console.error(errorMessage);
      return {
        statusCode: 400,
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
