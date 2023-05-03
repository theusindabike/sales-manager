import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from '../../src/transactions/transactions.module';
import { Transaction } from '../../src/transactions/entities/transaction.entity';
import { AppModule } from '../../src/app.module';
import { DataType, newDb } from 'pg-mem';
import { v4 } from 'uuid';
import { Repository } from 'typeorm';
import { TypeOrmOptionsFactory } from '@nestjs/typeorm';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Transaction>;

  beforeAll(async () => {
    const db = newDb();

    db.public.registerFunction({
      name: 'current_database',
      args: [],
      returns: DataType.text,
      implementation: () => '',
    });

    // db.registerExtension('uuid-ossp', (schema) => {
    //   schema.registerFunction({
    //     name: 'uuid_generate_v4',
    //     returns: DataType.uuid,
    //     implementation: v4,
    //     impure: true,
    //   });
    // });

    db.public.registerFunction({
      name: 'version',
      implementation: () =>
        'Im not sure about PostgreSQL version',
    });

    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [Transaction],
      synchronize: true,
    });

    const moduleFixture = await Test.createTestingModule({
      imports: [
        //TransactionsModule,
        AppModule,
      ],
    })
      .overrideProvider('DATA_SOURCE')
      .useValue(connection)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = app.get<Repository<Transaction>>('TRANSACTION_REPOSITORY');
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });
});
