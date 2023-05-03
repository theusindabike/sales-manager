import { Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionsService {
  constructor(
    // @Inject('TRANSACTION_REPOSITORY')
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  create(createTransactionDto: CreateTransactionDto) {
    const newTransaction =
      this.transactionRepository.create(createTransactionDto);
    return this.transactionRepository.save(newTransaction);
  }

  findAll() {
    return `This action returns all transactions`;
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

  async ingestSalesFile() {
    const filePath = '/home/node/api/src/assets/sales_test.txt';

    const fieldPositions = [
      { name: 'type', startsAt: 0, endsAt: 1 },
      { name: 'date', startsAt: 1, endsAt: 26 },
      { name: 'productDescription', startsAt: 26, endsAt: 56 },
      { name: 'value', startsAt: 56, endsAt: 66 },
      { name: 'sellerName', startsAt: 66, endsAt: 86 },
    ];
    const data = fs.readFileSync(filePath, 'utf8');
    let parsedTransactions = [];
    if (!data) {
      // console.error(err);
      throw new Error('Somethin went wrong');
    }

    const lines = data.split('\n');

    parsedTransactions = lines.map((line) => {
      const row = {};

      fieldPositions.forEach(({ name, startsAt, endsAt }) => {
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
    return parsedTransactions;
  }
}
