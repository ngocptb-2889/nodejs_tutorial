import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
  synchronize: false,
  logging: process.env.APP_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;