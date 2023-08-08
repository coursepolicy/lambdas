import "dotenv/config";

import { db } from "../../data/knex";
import { ExtendedApiGateWayEvent } from "../types";
import { baseUrl } from "../utilities/constants";
import { saveSurveyResponse } from "./helpers";

const { SURVEY_ID, QUALTRICS_API_TOKEN } = process.env;

export const surveyHookHandler = async ({
  parsedBody: { responseId },
}: ExtendedApiGateWayEvent) => {
  const response = await fetch(
    `${baseUrl}/surveys/${SURVEY_ID}/responses/${responseId}`,
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "X-API-TOKEN": QUALTRICS_API_TOKEN as string,
      },
    }
  );

  if (response.status !== 200) {
    throw new Error("Qualtrics API call failed");
  }
  const data = await response.json();

  await saveSurveyResponse(data, db);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "DB Insert Success" }),
  };
};
