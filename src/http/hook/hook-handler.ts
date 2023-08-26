import 'dotenv/config';

import { db } from '../../../data/knex';
import { baseUrl } from '../../shared/constants';
import { saveSurveyResponse } from './helpers';
import { get } from 'lodash';
import { ExtendedApiGateWayEvent } from './types';
import { surveyResponseMapper } from './survey-mapper';
import { ResponseObject } from '../../shared';
import { createPolicyOutline } from './create-policy-outline';
import { policyFormatter } from './policy-formatter';

const { SURVEY_ID, QUALTRICS_API_TOKEN } = process.env;

export const surveyHookHandler = async ({
  parsedBody: { responseId, saveDb },
}: ExtendedApiGateWayEvent) => {
  try {
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
    const data: { result: ResponseObject } = await response.json();
    const id = String(get(data, 'result.values.QID13_TEXT'));

    if (saveDb === false) {
      const queriedResponse = await db('survey_responses')
        .where({ id })
        .first();

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'DB Insert Skipped', queriedResponse }),
      };
    }

    const mappedData = surveyResponseMapper(data.result);
    const courseAiPolicy = createPolicyOutline(mappedData);
    const courseAiPolicyResponse = policyFormatter(courseAiPolicy, mappedData);
    const result = await saveSurveyResponse({
      coursePolicyData: courseAiPolicyResponse,
      database: db,
      policyId: id,
      rawResponse: data.result,
    });

    if (!result) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'DB failure',
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'DB Insert Success',
        generatedId: 'TESTING_OVERRIDE',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
