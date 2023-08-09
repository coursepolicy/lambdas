import "dotenv/config";

import { db } from "../../data/knex";
import { ExtendedApiGateWayEvent } from "../shared/types";

export const surveyResponseHandler = async ({
  parsedQueryParams: { generatedId },
}: ExtendedApiGateWayEvent) => {
  const data = await db("survey_responses").where("id", generatedId);

  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  };
};
