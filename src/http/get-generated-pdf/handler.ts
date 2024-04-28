import 'dotenv/config';
import { generatePdf } from './services';
import { ExtendedApiGateWayEvent } from './utils';

export const getGeneratedPdf = async (event: ExtendedApiGateWayEvent) => {
  console.info('getGeneratedPdf Event', { event });
  const {
    queryStringParameters: { generatedId },
  } = event;
  try {
    const pdf = await generatePdf(generatedId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/pdf' },
      body: pdf.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error }),
    };
  }
};
