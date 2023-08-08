import { Knex } from "knex";

const { DB_BASE_URL, DB_READONLY_BASE_URL } = process.env;

const defaultConfig: Knex.Config = {
  client: "pg",
  connection: DB_BASE_URL,
  migrations: {
    directory: "./data/migrations",
    extension: "js",
  },
  acquireConnectionTimeout: 5000,
  pool: {
    min: 1,
    max: 10,
    createTimeoutMillis: 8000,
    acquireTimeoutMillis: 8000,
    idleTimeoutMillis: 8000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
    propagateCreateError: false,
    destroyTimeoutMillis: 8000,
  },
};

export type Environment = keyof typeof environments;

const databaseTypeEnum = {
  reader: "reader",
  writer: "writer",
} as const;

type DatabaseTypeKeys = keyof typeof databaseTypeEnum;

export const getConfig = (type: DatabaseTypeKeys) => {
  const connection = {
    reader: DB_READONLY_BASE_URL,
    writer: DB_BASE_URL,
  };

  return {
    ...defaultConfig,
    connection: connection[type],
  };
};

const environments = {
  development: defaultConfig,
  staging: defaultConfig,
  production: defaultConfig,
};

export default environments;
