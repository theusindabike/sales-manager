import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transactions.repository';

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
        insert: jest.fn().mockResolvedValue(true),
        update: jest.fn().mockResolvedValue(true),
        delete: jest.fn().mockResolvedValue(true),
        getSellerBalance: jest.fn().mockReturnValue({ balance: 85 }),
        getAffiliateBalance: jest.fn().mockReturnValue({ balance: 65 }),
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
    const result = await service.getBalance(SELLER_1);
    expect(result).toEqual({
      name: SELLER_1,
      balanceAsSeller: 85,
      balanceAsAffiliate: 65,
    });
  });
});
