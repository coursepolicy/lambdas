import 'dotenv/config';

import { db } from '../../../data/knex';
import { baseUrl } from '../../shared/utilities/constants';
import { saveSurveyResponse } from './helpers';
import { get } from 'lodash';
import { ExtendedApiGateWayEvent } from './types';

const { SURVEY_ID, QUALTRICS_API_TOKEN } = process.env;

export const surveyHookHandler = async ({
  parsedBody: { responseId, saveDb },
}: ExtendedApiGateWayEvent) => {
  const response = await fetch(
    `${baseUrl}/surveys/${SURVEY_ID}/responses/${responseId}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-API-TOKEN': QUALTRICS_API_TOKEN as string,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error('Qualtrics API call failed');
  }
  const data = await response.json();
  const id = get(data, 'result.values.QID13_TEXT');

  if (saveDb === false) {
    const queriedResponse = await db('survey_responses').where({ id }).first();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'DB Insert Skipped', queriedResponse }),
    };
  }
  await saveSurveyResponse(data, db);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'DB Insert Success', generatedId: id }),
  };
};
