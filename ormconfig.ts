import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
require('dotenv').config();

initializeTransactionalContext();

let dataSourceInstance: DataSource | null = null;

export const dataSourceOptions = (
  configService: ConfigService,
): DataSourceOptions & SeederOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  entities: ['dist/src/domain/**/*.entity.js'],
  synchronize: false,
  migrationsTableName: 'migrations',
  migrations: ['dist/src/infrastructure/database/migrations/*.js'],
  seedTableName: 'seeds',
  seedName: 'seeder',
  seeds: ['dist/src/infrastructure/database/seeders/*.js'],
  seedTracking: true,
});

export const dataSource = (() => {
  if (!dataSourceInstance) {
    dataSourceInstance = new DataSource(dataSourceOptions(new ConfigService()));
    return addTransactionalDataSource(dataSourceInstance);
  }
  return dataSourceInstance;
})();

