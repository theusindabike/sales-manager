import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionRepository } from './repository/transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(TransactionRepository)
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

  async findOne(id: number): Promise<Transaction> {
    return this.transactionRepository.findOneOrFail({ where: { id: id } });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  findBy(sellerName: string) {
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

  getBalance(name: string): any {
    const balanceAsSeller = this.transactionRepository.getSellerBalance(name);

    const balanceAsAffiliate =
      this.transactionRepository.getSellerBalance(name);

    return {
      name: name,
      balanceAsSeller: balanceAsSeller['balance'],
      balanceAsAffiliate: balanceAsAffiliate['balance'],
    };
  }
}
