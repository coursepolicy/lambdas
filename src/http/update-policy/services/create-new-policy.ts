import { db } from '../../../../data/knex';
import { CourseAiPolicyResponse } from '../../../shared';

export const createNewPolicy = async (
  id: string,
  policy: CourseAiPolicyResponse
): Promise<string> => {
  return db('survey_responses')
    .returning('id')
    .insert({
      id,
      results: JSON.stringify(policy),
      created_at: db.fn.now(),
      updated_at: db.fn.now(),
    });
};
