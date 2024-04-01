import 'dotenv/config';

import { flow } from 'lodash';
import { ExtendedApiGateWayEvent } from './utils/types';
import { surveyResponseMapper } from './services/survey-response-mapper';
import { createCoursePolicy } from './services/create-course-policy';
import { saveCoursePolicy } from './services/save-course-policy';
import { getFullResponseData } from './services/get-full-response-data';
import { hgseSurveyResponseMapper } from "./services/hgse-survey-response-mapper";
import { SurveyResponse } from "../../shared";

const { SURVEY_ID } = process.env;

export const postPolicyWebhookHandler = async ({
  parsedBody: { responseId: surveyResponseId, organization },
}: ExtendedApiGateWayEvent) => {
  try {
    console.info({
      message: 'Qualtrics Webhook',
      surveyId: SURVEY_ID,
      responseId: surveyResponseId,
    });

    const data = await getFullResponseData(surveyResponseId);

    const mapper = (organization?: string) => (response: SurveyResponse) =>  {
      if (organization === 'harvard') {
        return hgseSurveyResponseMapper(response);
      }
      return surveyResponseMapper(response);
    }

    const savedPolicyId = flow(
      mapper(organization),
      createCoursePolicy(organization),
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

