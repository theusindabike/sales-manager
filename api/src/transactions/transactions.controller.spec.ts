import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ImportTransactionsService } from './services/import-transactions.service';
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

const transactionTwo = new Transaction(
  null,
  TransactionType.COMMISSION_PAID,
  new Date('2022-01-16T14:13:54-03:00'),
  'DOMINANDO INVESTIMENTOS',
  15,
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
  transactionTwo,
  new Transaction(
    null,
    TransactionType.COMMISSION_RECIEVED,
    new Date('2022-01-16T14:13:54-03:00'),
    'DOMINANDO INVESTIMENTOS',
    15,
    AFFILIATE_1,
  ),
];
describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const transactionRepositoryMockProvider = {
      provide: TransactionRepository,
      useValue: {
        find: jest.fn().mockResolvedValue(
          transactions.map((t) => {
            return Transaction.of(t);
          }),
        ),
        findAndCountBy: jest
          .fn()
          .mockResolvedValue([
            Transaction.of(transactionOne),
            Transaction.of(transactionTwo),
          ]),
        getSellerBalance: jest.fn().mockReturnValue({ balance: 85 }),
        getAffiliateBalance: jest.fn().mockReturnValue({ balance: 65 }),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        { provide: ImportTransactionsService, useValue: {} },
        transactionRepositoryMockProvider,
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findTransactions with sellerName', () => {
    controller.findBySellerName();
    expect(controller.findBySellerName(SELLER_1)).resolves.toEqual([
      transactionOne,
      transactionTwo,
    ]);
  });

  it('findTransactions without sellerName', () => {
    controller.findBySellerName();
    expect(controller.findBySellerName()).resolves.toEqual(transactions);
  });
});
