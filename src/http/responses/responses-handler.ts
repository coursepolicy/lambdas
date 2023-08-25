import 'dotenv/config';
import { ExtendedApiGateWayEvent } from './types';
import { longPolling } from './long-polling';
import {
  createCourseAiPolicyOutline,
  surveyResponseMapper,
} from './survey-response-mapper';

export const responsesHandler = async ({
  queryStringParameters: { generatedId },
}: ExtendedApiGateWayEvent) => {
  try {
    const data = await longPolling(generatedId);
    const mappedData = surveyResponseMapper(data.results);
    const courseAiPolicy = createCourseAiPolicyOutline(mappedData);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: courseAiPolicy }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
