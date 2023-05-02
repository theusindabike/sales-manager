import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import fs from 'fs';

@Injectable()
export class TransactionsService {
  constructor(
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

  findOne(id: number) {
    return this.transactionRepository.findOne({ where: { id: id } });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  ingestSalesFile() {
    const filePath =
      '/home/matheus/Downloads/desafio-programacao-fullstack-1.2.0/sales.txt';
    const fieldPositions = [
      { name: 'type', startsAt: 0, endsAt: 0 },
      { name: 'date', startsAt: 1, endsAt: 25 },
      { name: 'productDescription', startsAt: 26, endsAt: 55 },
      { name: 'value', startsAt: 56, endsAt: 65 },
      { name: 'sellerName', startsAt: 66, endsAt: 85 },
    ];

    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) {
        console.error(err);
        throw new Error('Somethin went wrong: ' + err);
      }

      const lines = data.split('\n');

      const values = lines.map((line) => {
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

        return row;
      });
    });
  }
}
