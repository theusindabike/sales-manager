import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transactions.repository';
import { BalanceDto } from './dto/balance.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const newTransaction =
      this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(newTransaction);
  }

  findAll(): Promise<Transaction[]> {
    return this.transactionRepository.find({ order: { date: 'ASC' } });
  }

  findBySellerName(sellerName: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { sellerName: sellerName },
      order: { date: 'ASC' },
    });
  }

  async saveImportedTransactions(
    transactions: Transaction[],
  ): Promise<Transaction[]> {
    const t = this.transactionRepository.create(transactions);
    await this.transactionRepository.insert(t);
    return t;
  }

  async getBalanceByName(name: string): Promise<BalanceDto> {
    const [
      sellerSalesResult,
      affiliateCommissionResult,
      affiliateSalesToSellerRecieveResult,
    ] = await Promise.all([
      this.transactionRepository.getSellerSalesCommissionDiscountedByName(name),
      this.transactionRepository.getAffiliateCommissionByName(name),
      this.transactionRepository.getAffiliateSalesToSellerRecieveBySellerName(
        name,
      ),
    ]);

    const balanceAsSeller =
      (sellerSalesResult ? sellerSalesResult.value : 0) +
      (affiliateSalesToSellerRecieveResult
        ? affiliateSalesToSellerRecieveResult.value
        : 0);
    const balanceAsAffiliate = affiliateCommissionResult
      ? affiliateCommissionResult.value
      : 0;

    return BalanceDto.of({
      name: name,
      balanceAsSeller: balanceAsSeller,
      balanceAsAffiliate: balanceAsAffiliate,
    });
  }
}
