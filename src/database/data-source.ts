import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import { config } from 'dotenv';
import { register } from 'tsconfig-paths';

config();

// Register TypeScript path mappings for TypeORM CLI
register({
  baseUrl: join(__dirname, '../..'),
  paths: {
    'src/*': ['src/*'],
  },
});

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.APP_ENV === 'development',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;