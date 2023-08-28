import { isEmpty } from 'lodash';
import { db } from '../../../../data/knex';

const MAX_TIME_ALOTTED = 15_000;
const TIME_TO_WAIT = 1_000;

export const longPolling = async (generatedId: string) => {
  const startTime = Date.now();

  let timeoutExceeded = false;
  while (!timeoutExceeded) {
    const data = await db('survey_responses')
      .where({ id: generatedId })
      .first();

    const found = !isEmpty(data);

    if (found) {
      return data;
    }

    if (Date.now() - startTime > MAX_TIME_ALOTTED) {
      timeoutExceeded = true;
    }

    await new Promise((resolve) => setTimeout(resolve, TIME_TO_WAIT));
  }

  return {
    statusCode: 409,
    body: JSON.stringify({
      message:
        'Timeout Exceeded! Failure to find the record. Please complete the survey and try again',
    }),
  };
};
