import 'dotenv/config';

import { QaultricsResponse, qualtricsBaseUrl } from '../../../shared';
import {surveyIdMapper} from "../utils/helpers";

const { QUALTRICS_API_TOKEN } = process.env;

export const getFullResponseData = async (
  id: string,
  institution: string
): Promise<QaultricsResponse> => {
  const surveyId = surveyIdMapper(institution);
  const response = await fetch(
    `${qualtricsBaseUrl}/surveys/${surveyId}/responses/${id}`,
    {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-API-TOKEN': QUALTRICS_API_TOKEN as string,
      },
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error({
      message: `Qualtrics API call failed: ${errorMessage}`,
      surveyId,
      QUALTRICS_API_TOKEN: QUALTRICS_API_TOKEN?.length,
      responseId: id,
    });
    throw new Error(errorMessage || 'Qualtrics API call failed');
  }
  return response.json();
};
