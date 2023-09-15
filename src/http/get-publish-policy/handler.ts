import 'dotenv/config';
import { ExtendedApiGateWayEvent } from './utils/types';
import { db } from '../../../data/knex';

// TODO - make this similar to update policy handler
export const getPolicyHandler = async ({
  queryStringParameters: { publishId },
}: ExtendedApiGateWayEvent) => {
  try {
    const aiPolicy = await db('publish_policies')
      .where({ publish_id: publishId })
      .first();

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
