import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppModule } from '../../src/app.module';
import { TransactionType } from '../../src/transactions/entities/transaction.entity';

import { setupDatabase } from '../setup-database';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const dataSource = await setupDatabase();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('/transactions (POST)', async () => {
    const transaction = {
      type: TransactionType.AFFILIATE_SALE,
      date: '2022-01-16T14:13:54-03:00',
      productDescription: 'Product Descriptin 1',
      value: 666,
      sellerName: 'Seller name',
    };
    const data = await request(app.getHttpServer())
      .post('/transactions')
      .send(transaction)
      .expect(201);

    expect(data.body).toEqual({ id: '1', ...transaction });
  });

  it('/transactions/ingestTransactionFile (POST)', () => {
    return request(app.getHttpServer())
      .post('/transactions/upload')
      .attach('file', './src/assets/sales_test.txt')
      .expect(201);
  });
});
