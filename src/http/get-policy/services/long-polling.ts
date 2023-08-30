import { isEmpty } from 'lodash';
import { db } from '../../../../data/knex';
import { AiPolicyResponse } from '../../../shared';

const MAX_TIME_ALOTTED = 15_000;
const TIME_TO_WAIT = 1_000;

export const longPolling = async (
  generatedId: string
): Promise<AiPolicyResponse> => {
  const startTime = Date.now();

  let timeoutExceeded = false;
  while (!timeoutExceeded) {
    const data = await db('survey_responses')
      .where({ id: generatedId })
      .first();

    const found = !isEmpty(data);

    if (found) {
      const { results } = data;
      return {
        ...results,
        id: data.id,
        updatedAt: data.updated_at,
        createdAt: data.created_at,
      };
    }

    if (Date.now() - startTime > MAX_TIME_ALOTTED) {
      timeoutExceeded = true;
    }

    await new Promise((resolve) => setTimeout(resolve, TIME_TO_WAIT));
  }

  throw new Error(
    'Timeout Exceeded! Failure to find the record. Please complete the survey and try again'
  );
};
