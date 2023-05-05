import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionRepository: TransactionRepository, // private readonly transactionRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction =
      this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(newTransaction);
  }

  findAll() {
    return this.transactionRepository.find();
  }

  findAllBySellerName(sellerName: string) {
    return this.transactionRepository.findAndCountBy({
      sellerName: sellerName,
    });
  }

  async ingestSalesFile(file: Express.Multer.File): Promise<Transaction[]> {
    const fieldsSchema = [
      { name: 'type', startsAt: 0, endsAt: 1 },
      { name: 'date', startsAt: 1, endsAt: 26 },
      { name: 'productDescription', startsAt: 26, endsAt: 56 },
      { name: 'value', startsAt: 56, endsAt: 66 },
      { name: 'sellerName', startsAt: 66, endsAt: 86 },
    ];

    if (!file) {
      throw new Error('Somethin went wrong');
    }

    const allFileLines = Buffer.from(file.buffer).toString('utf-8');
    const linesArray = allFileLines.split('\n');

    const parsedTransactions = linesArray
      .filter((line) => line.length > 0)
      .map((line) => {
        const row = {};

        fieldsSchema.forEach(({ name, startsAt, endsAt }) => {
          row[name] = line.substring(startsAt, endsAt).trim();
        });

        if (
          !row['type'] ||
          !row['date'] ||
          !row['productDescription'] ||
          !row['value'] ||
          !row['sellerName']
        ) {
          throw new Error('Missing field in line: ' + line);
        }

        return new Transaction(
          null,
          parseInt(row['type']),
          new Date(row['date']),
          row['productDescription'],
          parseFloat(row['value']),
          row['sellerName'],
        );
      });
    const transactions = this.transactionRepository.create(parsedTransactions);
    await this.transactionRepository.insert(transactions);

    return transactions;
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
