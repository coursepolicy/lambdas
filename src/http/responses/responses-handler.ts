import 'dotenv/config';
import { ExtendedApiGateWayEvent } from '../../shared/types';
import { longPolling } from './long-polling';
import {
  createCourseAiPolicyOutline,
  formatResponse,
  surveyResponseMapper,
} from './survey-response-mapper';

export const responsesHandler = async ({
  queryStringParameters: { generatedId },
}: ExtendedApiGateWayEvent) => {
  try {
    const data = await longPolling(generatedId);
    const mappedData = surveyResponseMapper(data.results);
    const courseAiPolicy = createCourseAiPolicyOutline(mappedData);
    const courseAiPolicyResponse = formatResponse(courseAiPolicy, mappedData);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: courseAiPolicyResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
