import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

const transactionsRaw = [
  '12022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS',
  '12021-12-03T11:46:02-03:00DOMINANDO INVESTIMENTOS       0000050000MARIA CANDIDA',
  '22022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000012750THIAGO OLIVEIRA',
];

const transactionOne = new Transaction(
  null,
  TransactionType.PRODUCER_SALE,
  new Date('2022-01-15T19:20:30-03:00'),
  'CURSO DE BEM-ESTAR',
  12750,
  'JOSE CARLOS',
);

const transactions = [
  transactionOne,
  new Transaction(
    null,
    TransactionType.PRODUCER_SALE,
    new Date('2021-12-03T11:46:02-03:00'),
    'DOMINANDO INVESTIMENTOS',
    50000,
    'MARIA CANDIDA',
  ),
  new Transaction(
    null,
    TransactionType.AFFILIATE_SALE,
    new Date('2022-01-16T14:13:54-03:00'),
    'CURSO DE BEM-ESTAR',
    12750,
    'THIAGO OLIVEIRA',
  ),
];

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            find: jest.fn().mockResolvedValue(transactions),
            findOneOrFail: jest.fn().mockResolvedValue(transactionOne),
            create: jest.fn().mockReturnValue(transactionOne),
            save: jest.fn(),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ingestSalesFile', () => {
    it('should parse raw transactions to Transaction Object', async () => {
      expect(service.ingestSalesFile()).resolves.toEqual(transactions);
    });
  });
});
