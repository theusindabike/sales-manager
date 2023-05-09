import { Test, TestingModule } from '@nestjs/testing';
import { Transaction, TransactionType } from './../entities/transaction.entity';
import { TransactionRepository } from './../repository/transactions.repository';
import { DataSource } from 'typeorm';
import { setupDatabase } from '../../../test/setup-database';

describe('TransactionsService', () => {
  const seller_1 = 'JOSE CARLOS';
  const affiliate_1 = 'MARIA CANDIDA';

  const transactions = [
    new Transaction(
      null,
      TransactionType.PRODUCER_SALE,
      new Date('2022-01-15T19:20:30-03:00'),
      'CURSO DE BEM-ESTAR',
      127.5,
      seller_1,
    ),
    new Transaction(
      null,
      TransactionType.AFFILIATE_SALE,
      new Date('2021-12-03T11:46:02-03:00'),
      'CURSO DE BEM-ESTAR',
      127.5,
      affiliate_1,
    ),
    new Transaction(
      null,
      TransactionType.COMMISSION_PAID,
      new Date('2022-01-16T14:13:54-03:00'),
      'CURSO DE BEM-ESTAR',
      45,
      seller_1,
    ),
    new Transaction(
      null,
      TransactionType.COMMISSION_RECIEVED,
      new Date('2022-01-16T14:13:54-03:00'),
      'CURSO DE BEM-ESTAR',
      45,
      affiliate_1,
    ),
  ];
  let dataSource: DataSource;
  let transactionRepository: TransactionRepository;

  beforeAll(async () => {
    dataSource = await setupDatabase();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    transactionRepository.create(transactions);
    await transactionRepository.insert(transactions);
  });

  afterEach(async () => {
    await transactionRepository.clear();
  });

  it('should be defined', () => {
    expect(transactionRepository).toBeDefined();
  });

  it('get seller balance', async () => {
    const result = await transactionRepository.getSellerBalanceByName(seller_1);
    expect(result).toEqual({
      name: seller_1,
      balance: transactions[0].value - transactions[2].value,
    });
  });

  it('get affiliate balance', async () => {
    const result = await transactionRepository.getAffiliateBalanceByName(
      affiliate_1,
    );
    expect(result).toEqual({
      name: affiliate_1,
      balance: transactions[1].value + transactions[3].value,
    });
  });
});
