import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ImportTransactionsService } from './services/import-transactions.service';
import { Transaction, TransactionType } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transactions.repository';

describe('TransactionsController', () => {
  const seller_1 = 'JOSE CARLOS';
  const affiliate_1 = 'MARIA CANDIDA';

  let controller: TransactionsController;
  let transactionService: TransactionsService;

  beforeEach(async () => {
    const transactionRepositoryMockProvider = {
      provide: TransactionRepository,
      useValue: {
        find: jest.fn(),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        transactionRepositoryMockProvider,
        { provide: ImportTransactionsService, useValue: {} },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionService = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findTransactions with sellerName', () => {
    const result = [
      Transaction.of({
        type: TransactionType.PRODUCER_SALE,
        date: new Date('2022-01-15T19:20:30-03:00'),
        productDescription: 'CURSO DE BEM-ESTAR',
        value: 100,
        sellerName: seller_1,
      }),
    ];
    jest
      .spyOn(transactionService, 'findBySellerName')
      .mockResolvedValue(result);
    controller.findBySellerName();
    expect(controller.findBySellerName(seller_1)).resolves.toEqual(result);
  });

  it('findTransactions without sellerName', () => {
    const result = [
      Transaction.of({
        type: TransactionType.PRODUCER_SALE,
        date: new Date('2022-01-15T19:20:30-03:00'),
        productDescription: 'CURSO DE BEM-ESTAR',
        value: 100,
        sellerName: seller_1,
      }),
      Transaction.of({
        type: TransactionType.AFFILIATE_SALE,
        date: new Date('2022-01-16T14:13:54-03:00'),
        productDescription: 'DOMINANDO INVESTIMENTOS',
        value: 50,
        sellerName: affiliate_1,
      }),
    ];
    jest.spyOn(transactionService, 'findAll').mockResolvedValue(result);
    controller.findBySellerName();
    expect(controller.findBySellerName()).resolves.toEqual(result);
  });
});
