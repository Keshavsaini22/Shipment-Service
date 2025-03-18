import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSource, dataSourceOptions } from 'ormconfig';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        dataSourceOptions(configService),
      inject: [ConfigService],
      async dataSourceFactory() {
        return dataSource;
      },
    }),
  ],
})
export class TypeOrmModule {}
