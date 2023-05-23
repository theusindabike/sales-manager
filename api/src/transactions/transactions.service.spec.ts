import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { TransactionRepository } from './repository/transactions.repository';
import { TransactionValuesDto } from './dto/balance.dto';

describe('TransactionsService', () => {
  const seller_1 = 'JOSE CARLOS';
  const affiliate_1 = 'MARIA CANDIDA';
  let service: TransactionsService;

  beforeEach(async () => {
    const transactionRepositoryMockProvider = {
      provide: TransactionRepository,
      useValue: {
        getSellerSalesCommissionDiscountedByName: jest.fn().mockReturnValue(
          TransactionValuesDto.of({
            name: 'Mrs Seller',
            value: 135.75,
          }),
        ),
        getAffiliateCommissionByName: jest.fn().mockReturnValue(
          TransactionValuesDto.of({
            name: 'Mrs Affiliate',
            value: 15.25,
          }),
        ),
        getAffiliateSalesToSellerRecieveBySellerName: jest.fn().mockReturnValue(
          TransactionValuesDto.of({
            name: 'Mrs Seller',
            value: 50,
          }),
        ),
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
      balanceAsSeller: 185.75,
      balanceAsAffiliate: expect.any(Number),
    });
  });

  it('get affiliate transactions', async () => {
    const result = await service.getBalanceByName(affiliate_1);
    expect(result).toEqual({
      name: affiliate_1,
      balanceAsSeller: expect.any(Number),
      balanceAsAffiliate: 15.25,
    });
  });
});
