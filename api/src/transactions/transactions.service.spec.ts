import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transactions.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const transactionsRaw = [
  '12022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS',
  '12021-12-03T11:46:02-03:00DOMINANDO INVESTIMENTOS       0000050000MARIA CANDIDA',
  '22022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000012750THIAGO OLIVEIRA',
];

const SELLER_1 = 'JOSE CARLOS';
const AFFILIATE_1 = 'MARIA CANDIDA';

const transactionOne = new Transaction(
  null,
  TransactionType.PRODUCER_SALE,
  new Date('2022-01-15T19:20:30-03:00'),
  'CURSO DE BEM-ESTAR',
  100,
  SELLER_1,
);

const transactions = [
  transactionOne,
  new Transaction(
    null,
    TransactionType.AFFILIATE_SALE,
    new Date('2021-12-03T11:46:02-03:00'),
    'DOMINANDO INVESTIMENTOS',
    50,
    AFFILIATE_1,
  ),
  new Transaction(
    null,
    TransactionType.COMMISSION_PAID,
    new Date('2022-01-16T14:13:54-03:00'),
    'DOMINANDO INVESTIMENTOS',
    15,
    SELLER_1,
  ),
  new Transaction(
    null,
    TransactionType.COMMISSION_RECIEVED,
    new Date('2022-01-16T14:13:54-03:00'),
    'DOMINANDO INVESTIMENTOS',
    15,
    AFFILIATE_1,
  ),
];

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const transactionRepositoryMockProvider = {
      provide: TransactionRepository,
      useValue: {
        find: jest.fn().mockResolvedValue(transactions),
        findOneOrFail: jest.fn().mockResolvedValue(transactionOne),
        create: jest.fn().mockReturnValue(transactionOne),
        save: jest.fn(),
        update: jest.fn().mockResolvedValue(true),
        delete: jest.fn().mockResolvedValue(true),
        getSellerBalance: jest.fn().mockReturnValue({ balance: 85 }),
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

  it('get seller transactions', () => {
    expect(service.getBalance(SELLER_1)).toEqual({
      name: SELLER_1,
      balanceAsSeller: 85,
      balanceAsAffiliate: 85,
    });
  });
});
