import { Knex } from "knex";

export const saveSurveyResponse = (data: any, db: Knex) => {
  const uuid = data.result.values.QID13_TEXT;

  return db("survey_responses").insert({
    uuid,
    survey_results: JSON.stringify(data.result),
  });
};
