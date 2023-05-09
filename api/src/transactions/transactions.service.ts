import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction =
      this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(newTransaction);
  }

  findAll() {
    return this.transactionRepository.find({ order: { date: 'ASC' } });
  }

  findBySellerName(sellerName: string) {
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

  async getBalance(name: string): Promise<any> {
    const balanceAsSeller = await this.transactionRepository.getSellerBalance(
      name,
    );

    const balanceAsAffiliate =
      await this.transactionRepository.getAffiliateBalance(name);

    return {
      name: name,
      balanceAsSeller: balanceAsSeller ? balanceAsSeller['balance'] : 0,
      balanceAsAffiliate: balanceAsAffiliate
        ? balanceAsAffiliate['balance']
        : 0,
    };
  }
}
