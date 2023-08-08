import "dotenv/config";

import { readerDb } from "../../data/knex";
import { ExtendedApiGateWayEvent } from "../shared/types";

export const surveyResponseHandler = async ({
  parsedQueryParams: { generatedId },
}: ExtendedApiGateWayEvent) => {
  const data = await readerDb("survey_responses").where("uuid", generatedId);

  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
};
