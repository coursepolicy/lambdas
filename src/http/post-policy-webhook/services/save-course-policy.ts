import { CourseAiPolicyResponse, DataResponseObject } from '../../../shared';
import { get, isEmpty } from 'lodash';
import { db } from '../../../../data/knex';

export const saveCoursePolicy = async (data: DataResponseObject) => {
  const { result } = data;
  const generatedUuid = String(get(data, 'result.values.QID13_TEXT'));
  const existingResponse = await db('survey_responses')
    .where({ id: generatedUuid })
    .first();

  return async (coursePolicy: CourseAiPolicyResponse): Promise<string> => {
    if (!isEmpty(existingResponse)) {
      return await db('survey_responses')
        .where({ id: generatedUuid })
        .update({
          results: JSON.stringify(coursePolicy),
          raw_response: JSON.stringify(data),
          response_id: result.responseId,
          updated_at: db.fn.now(),
        })
        .returning('id');
    }

    return await db('survey_responses')
      .insert({
        id: generatedUuid,
        results: JSON.stringify(coursePolicy),
        raw_response: JSON.stringify(data),
        response_id: result.responseId,
        updated_at: db.fn.now(),
      })
      .returning('id');
  };
};
