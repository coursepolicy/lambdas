import { Knex } from 'knex';
import { isEmpty } from 'lodash';
import { CourseAiPolicyResponse, ResponseObject } from '../../shared';

export const saveSurveyResponse = async ({
  data,
  db,
  id,
  raw,
}: {
  data: CourseAiPolicyResponse;
  db: Knex;
  id: string;
  raw: ResponseObject;
}) => {
  const existingResponse = await db('survey_responses').where({ id }).first();

  if (!isEmpty(existingResponse)) {
    return db('survey_responses')
      .where({ id })
      .update({
        results: JSON.stringify(data),
        raw_response: JSON.stringify(raw),
        updated_at: db.fn.now(),
      });
  }

  return db('survey_responses').insert({
    id,
    results: JSON.stringify(data),
    raw_response: JSON.stringify(raw),
    updated_at: db.fn.now(),
  });
};

export const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
