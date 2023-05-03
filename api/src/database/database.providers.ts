import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { DataSource } from 'typeorm';
import { Injectable, Provider } from '@nestjs/common';


export function databaseProviders():Provider[] {
  return [
  {
    provide: 'DATA_SOURCE',
    useFactory: () => {        
        return TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: +configService.get<number>('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_NAME'),
            entities: [Transaction],
            // entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
            synchronize: true,
          }) as TypeOrmModuleOptions,
          dataSourceFactory: async (options) => {
            const dataSource = await new DataSource(options).initialize();
            return dataSource;
          }
        })
      },
    
    //   await createConnection({
    //     type: 'postgres',
    //     host: process.env.DB_HOST,
    //     port: Number(process.env.DB_PORT),
    //     username: process.env.DB_USER,
    //     password: process.env.DB_PASSWORD,
    //     database: 'test',
    //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //     synchronize: true, // Don't use this in the production
    //   }),

  },
]};
