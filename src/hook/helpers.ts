import { Knex } from "knex";
import { get } from "lodash";

export const saveSurveyResponse = (data: any, db: Knex) => {
  const id = get(data, "result.values.QID13_TEXT");

  return db("survey_responses").insert({
    id,
    results: JSON.stringify(data.result),
  });
};
