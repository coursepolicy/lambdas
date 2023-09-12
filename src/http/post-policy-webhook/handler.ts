import 'dotenv/config';

import { flow } from 'lodash';
import { ExtendedApiGateWayEvent } from './utils/types';
import { surveyResponseMapper } from './services/survey-response-mapper';
import { createCoursePolicy } from './services/create-course-policy';
import { saveCoursePolicy } from './services/save-course-policy';
import { getFullResponseData } from './services/get-full-response-data';

const { SURVEY_ID } = process.env;

export const postPolicyWebhookHandler = async ({
  parsedBody: { responseId: surveyResponseId },
}: ExtendedApiGateWayEvent) => {
  try {
    console.info({
      message: 'Qualtrics Webhook',
      surveyId: SURVEY_ID,
      responseId: surveyResponseId,
    });

    const data = await getFullResponseData(surveyResponseId);

    const savedPolicyId = flow(
      surveyResponseMapper,
      createCoursePolicy,
      await saveCoursePolicy(data)
    )(data.result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'DB Insert Success',
        generatedId: await savedPolicyId,
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
