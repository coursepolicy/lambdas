import 'dotenv/config';
import { Knex } from 'knex';

const { DATABASE_URL } = process.env;

const defaultConfig: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
  migrations: {
    directory: './data/migrations',
    extension: 'js',
  },
  acquireConnectionTimeout: 5000,
  pool: {
    min: 1,
    max: 10,
  },
};

export type Environment = keyof typeof environments;

const environments = {
  development: defaultConfig,
  staging: defaultConfig,
  production: defaultConfig,
};

export default environments;
