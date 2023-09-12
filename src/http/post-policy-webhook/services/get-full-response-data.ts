import 'dotenv/config';

import { QaultricsResponse, qualtricsBaseUrl } from '../../../shared';

const { SURVEY_ID, QUALTRICS_API_TOKEN } = process.env;

export const getFullResponseData = async (
  id: string
): Promise<QaultricsResponse> => {
  const response = await fetch(
    `${qualtricsBaseUrl}/surveys/${process.env.SURVEY_ID}/responses/${id}`,
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
      surveyId: SURVEY_ID,
      QUALTRICS_API_TOKEN: QUALTRICS_API_TOKEN?.length,
      responseId: id,
    });
    throw new Error(errorMessage || 'Qualtrics API call failed');
  }
  return response.json();
};
