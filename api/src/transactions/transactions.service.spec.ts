import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transactions.repository';

describe('TransactionsService', () => {
  const seller_1 = 'JOSE CARLOS';
  const affiliate_1 = 'MARIA CANDIDA';

  const transactionOne = new Transaction(
    null,
    TransactionType.PRODUCER_SALE,
    new Date('2022-01-15T19:20:30-03:00'),
    'CURSO DE BEM-ESTAR',
    100,
    seller_1,
  );

  const transactions = [
    transactionOne,
    new Transaction(
      null,
      TransactionType.AFFILIATE_SALE,
      new Date('2021-12-03T11:46:02-03:00'),
      'DOMINANDO INVESTIMENTOS',
      50,
      affiliate_1,
    ),
    new Transaction(
      null,
      TransactionType.COMMISSION_PAID,
      new Date('2022-01-16T14:13:54-03:00'),
      'DOMINANDO INVESTIMENTOS',
      15.25,
      seller_1,
    ),
    new Transaction(
      null,
      TransactionType.COMMISSION_RECIEVED,
      new Date('2022-01-16T14:13:54-03:00'),
      'DOMINANDO INVESTIMENTOS',
      15.25,
      affiliate_1,
    ),
  ];

  let service: TransactionsService;

  beforeEach(async () => {
    const transactionRepositoryMockProvider = {
      provide: TransactionRepository,
      useValue: {
        find: jest.fn().mockResolvedValue(transactions),
        create: jest.fn().mockReturnValue(transactionOne),
        getSellerBalanceByName: jest
          .fn()
          .mockReturnValue({ balance: 100 - 15.25 }),
        getAffiliateBalanceByName: jest
          .fn()
          .mockReturnValue({ balance: 50 + 15.25 }),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsService, transactionRepositoryMockProvider],
    }).compile();

    service = module.get(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get seller transactions', async () => {
    const result = await service.getBalanceByName(seller_1);
    expect(result).toEqual({
      name: seller_1,
      balanceAsSeller: 84.75,
      balanceAsAffiliate: expect.any(Number),
    });
  });

  it('get affiliate transactions', async () => {
    const result = await service.getBalanceByName(seller_1);
    expect(result).toEqual({
      name: seller_1,
      balanceAsSeller: expect.any(Number),
      balanceAsAffiliate: 65.25,
    });
  });
});
