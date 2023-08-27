import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import { CourseAiPolicyResponse, ResponseObject } from '../../shared';

export const saveSurveyResponse = async ({
  coursePolicyData,
  database,
  policyId,
  responseId,
  rawResponse,
}: {
  coursePolicyData: CourseAiPolicyResponse;
  database: Knex;
  policyId: string;
  responseId: string;
  rawResponse: ResponseObject;
}): Promise<string> => {
  const existingResponse = await database('survey_responses')
    .where({ id: policyId })
    .first();

  if (!isEmpty(existingResponse)) {
    return database('survey_responses')
      .where({ id: policyId })
      .update({
        results: JSON.stringify(coursePolicyData),
        raw_response: JSON.stringify(rawResponse),
        response_id: responseId,
        updated_at: database.fn.now(),
      })
      .returning('id');
  }

  return database('survey_responses')
    .insert({
      id: policyId,
      results: JSON.stringify(coursePolicyData),
      raw_response: JSON.stringify(rawResponse),
      response_id: responseId,
      updated_at: database.fn.now(),
    })
    .returning('id');
};

export const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
