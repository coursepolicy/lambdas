import 'dotenv/config';
import { ExtendedApiGateWayEvent } from './utils/types';
import { db } from '../../../data';

export const postPublishPolicyHandler = async (event: ExtendedApiGateWayEvent) => {
  console.info('postPublishPolicyHandler Event', { event });

  const {
    parsedBody: { publishId, policyId, policy },
  } = event;
  try {
    const exists = await db('publish_policies')
      .where({ id: publishId })
      .first();

    if (!exists) {
      const policyExists = await db('survey_responses')
        .where({ id: policyId })
        .first();

      if (!policyExists) {
        const errorMessage = 'Policy does not exist';
        console.error(errorMessage);
        return {
          statusCode: 400,
          body: JSON.stringify({
            message: errorMessage,
          }),
        };
      }

      await db('publish_policies').insert({
        id: publishId,
        ai_policy: policy,
      });
      await db('survey_responses')
        .where({ id: policyId })
        .update({ publish_id: publishId });
    } else {
      await db('publish_policies')
        .where({ id: publishId })
        .update({ ai_policy: policy });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'DB Insert Success',
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
