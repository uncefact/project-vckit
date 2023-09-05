import { DataSource, DataSourceOptions } from 'typeorm';
import { migrations, Entities } from './index.js';
import 'dotenv/config';

const dataSource = {
  type: process.env.DATABASE_TYPE as string,
  database: process.env.DATABASE_DATABASE as string,
  url: process.env.DATABASE_URL as string,
  entities: Entities,
  synchronize: false,
  logging: false,
  migrations: migrations,
};

export default new DataSource(dataSource as DataSourceOptions);
