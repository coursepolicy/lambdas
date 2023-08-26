import { isEmpty } from 'lodash';
import { db } from '../../../data/knex';

export const updatePolicy = async (id: string, policy: string) => {
  const updatedPolicy = await db('survey_responses').where({ id }).first();

  if (isEmpty(updatedPolicy)) {
    throw new Error('Policy does not exist');
  }

  return db('survey_responses')
    .where({ id })
    .update({
      results: JSON.stringify(policy),
      updated_at: db.fn.now(),
    })
    .returning('results');
};
