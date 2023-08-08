/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  if (await knex.schema.hasTable("survey_results")) return;

  return knex.schema.createTable("survey_responses", (table) => {
    table.string("uuid").primary().notNullable();
    table.jsonb("survey_results").notNullable();
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
