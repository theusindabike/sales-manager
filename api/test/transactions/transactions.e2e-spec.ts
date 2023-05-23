import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { setupDatabase } from '../setup-database';
import { AppModule } from '../../src/app.module';
import { TransactionRepository } from '../../src/transactions/repository/transactions.repository';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let transactionRepository: TransactionRepository;

  const sellerName_1 = 'JOSE CARLOS';

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
      .post('/transactions/upload')
      .attach('file', './test/transactions/assets/sales_test.txt');
  });

  afterEach(async () => {
    await transactionRepository.clear();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('Upload (e2e)', () => {
    it('/transactions/upload (POST)', async () => {
      const data = await request(app.getHttpServer()).get('/transactions');
      expect(data.body.length).toEqual(20);
    });
  });

  describe('Balance (e2e)', () => {
    it('/transactions/balance (GET)', async () => {
      const data = await request(app.getHttpServer())
        .get(`/transactions/balance?sellerName=${encodeURI(sellerName_1)}`)
        .expect(200);
      expect(data.body).toEqual({
        name: sellerName_1,
        balanceAsSeller: 337.5,
        balanceAsAffiliate: 0,
      });
    });
  });

  describe('Transactions (e2e)', () => {
    it('/transactions?sellerName=<?> (GET)', async () => {
      const data = await request(app.getHttpServer())
        .get(`/transactions?sellerName=${encodeURI(sellerName_1)}`)
        .expect(200);
      expect(data.body.length).toEqual(3);
    });
  });
});
