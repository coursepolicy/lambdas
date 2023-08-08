import "dotenv/config";

import { db, readerDb } from "../../data/knex";
import { ExtendedApiGateWayEvent } from "../shared/types";
import { baseUrl } from "../shared/utilities/constants";
import { saveSurveyResponse } from "./helpers";

const { SURVEY_ID, QUALTRICS_API_TOKEN } = process.env;

export const surveyHookHandler = async ({
  parsedBody: { responseId, saveDb },
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

  if (saveDb === false) {
    const uuid = data.result.values.QID13_TEXT;
    const queriedResponse = await readerDb("survey_responses").where({ uuid });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "DB Insert Skipped", queriedResponse }),
    };
  }
  await saveSurveyResponse(data, db);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "DB Insert Success" }),
  };
};
