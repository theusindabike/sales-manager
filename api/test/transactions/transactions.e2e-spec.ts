import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppModule } from '../../src/app.module';
import { TransactionType } from '../../src/transactions/entities/transaction.entity';

import { setupDatabase } from '../setup-database';
import { TransactionRepository } from '../../src/transactions/repository/transactions.repository';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let transactionRepository: TransactionRepository;

  const SELLER_NAME_1 = 'Seller name 1';
  const TRANSACTION_1 = {
    type: TransactionType.PRODUCER_SALE,
    date: '2022-01-16T14:13:54-03:00',
    productDescription: 'Product Description 1',
    value: 333,
    sellerName: SELLER_NAME_1,
  };

  const SELLER_NAME_2 = 'Affiliate name 1';
  const TRANSACTION_2 = {
    type: TransactionType.AFFILIATE_SALE,
    date: '2022-01-16T14:13:54-03:00',
    productDescription: 'Product Description 2',
    value: 666,
    sellerName: SELLER_NAME_2,
  };

  beforeAll(async () => {
    dataSource = await setupDatabase();
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [TransactionRepository],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();

    app = moduleFixture.createNestApplication();
    transactionRepository = moduleFixture.get<TransactionRepository>(
      TransactionRepository,
    );
    await app.init();
  });

  beforeEach(async () => {
    await request(app.getHttpServer())
      .post('/transactions')
      .send(TRANSACTION_1)
      .expect(201);
  });

  afterEach(async () => {
    // await transactionRepository.query(`TRUNCATE TABLE transaction;`);
    await transactionRepository.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200);
  });

  it('/transactions (POST)', async () => {
    const data = await request(app.getHttpServer())
      .post('/transactions')
      .send(TRANSACTION_2)
      .expect(201);

    expect(data.body).toEqual({ id: expect.any(String), ...TRANSACTION_2 });
  });

  it('/transactions/ingestTransactionFile (POST)', async () => {
    await request(app.getHttpServer())
      .post('/transactions/upload')
      .attach('file', './test/transactions/assets/sales_test.txt')
      .expect(201);

    const data = await request(app.getHttpServer()).get('/transactions');
    expect(data.body.length).toEqual(4);
  });

  it('/transactions/balance (GET)', async () => {
    const data = await request(app.getHttpServer())
      .get('/transactions/balance?sellerName=' + encodeURI(SELLER_NAME_1))
      .expect(200);
    expect(data.body).toEqual({
      name: SELLER_NAME_1,
      balanceAsSeller: 333,
      balanceAsAffiliate: 0,
    });
  });

  it('/transactions?sellerName=<?> (GET)', async () => {
    const data = await request(app.getHttpServer())
      .get('/transactions?sellerName=' + encodeURI(SELLER_NAME_1))
      .expect(200);

    expect(data.body[0]).toEqual({
      id: expect.any(Number),
      type: TRANSACTION_1.type,
      date: expect.any(String),
      productDescription: TRANSACTION_1.productDescription,
      value: TRANSACTION_1.value,
      sellerName: TRANSACTION_1.sellerName,
    });
  });
});
