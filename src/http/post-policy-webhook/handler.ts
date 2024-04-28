import 'dotenv/config';

import { flow } from 'lodash';
import { ExtendedApiGateWayEvent } from './utils/types';
import { surveyResponseMapper } from './services/survey-response-mapper';
import { createCoursePolicy } from './services/create-course-policy';
import { saveCoursePolicy } from './services/save-course-policy';
import { getFullResponseData } from './services/get-full-response-data';
import { hgseSurveyResponseMapper } from "./services/hgse-survey-response-mapper";
import { SurveyResponse } from "../../shared";

export const postPolicyWebhookHandler = async (event: ExtendedApiGateWayEvent) => {
  try {
    console.info('postPolicyWebhookHandler Event', JSON.stringify(event, null, 2));

    const {
      parsedBody: { responseId: surveyResponseId, organization: institution },
    } = event;

    const data = await getFullResponseData(surveyResponseId, institution || '');

    const mapper = (organization?: string) => (response: SurveyResponse) =>  {
      if (organization === 'harvard') {
        return hgseSurveyResponseMapper(response);
      }
      return surveyResponseMapper(response);
    }

    const savedPolicyId = flow(
      mapper(institution),
      createCoursePolicy(institution),
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

