import { BadRequestException, Injectable } from '@nestjs/common';
import { Transaction } from './../entities/transaction.entity';
import { RawTransactionDto } from './../dto/raw-transaction.dto';
import { ImportTransactionsServiceInterface } from './../import-transactions.interface';
import { TransactionsService } from './../transactions.service';
import { validateOrReject } from 'class-validator';

@Injectable()
export class ImportTransactionsService
  implements ImportTransactionsServiceInterface
{
  constructor(private readonly transactionService: TransactionsService) {}

  async importTransactions(file: Express.Multer.File): Promise<Transaction[]> {
    if (!file || !file.buffer) {
      throw new BadRequestException('Somethin went wrong: File not found');
    }

    const parsedTransactions = await this.parseTransactions(file);

    const transactions = await this.transactionService.saveImportedTransactions(
      parsedTransactions,
    );

    return transactions;
  }

  private async parseTransactions(file: Express.Multer.File) {
    const fieldsSchema = [
      { name: 'type', startsAt: 0, endsAt: 1 },
      { name: 'date', startsAt: 1, endsAt: 26 },
      { name: 'productDescription', startsAt: 26, endsAt: 56 },
      { name: 'value', startsAt: 56, endsAt: 66 },
      { name: 'sellerName', startsAt: 66, endsAt: 86 },
    ];

    const allFileLines = Buffer.from(file.buffer).toString('utf-8');
    const rawLines = allFileLines.split('\n');

    const parsedTransactions = await Promise.all(
      rawLines
        .filter((line) => line.length > 0)
        .map(async (line) => {
          const row = {};

          fieldsSchema.forEach(({ name, startsAt, endsAt }) => {
            row[name] = line.substring(startsAt, endsAt).trim();
          });

          const t = RawTransactionDto.fromRow(row);

          await this.validateOrRejectTransaction(t);
          return Transaction.of(t);
        }),
    );
    return parsedTransactions;
  }

  private async validateOrRejectTransaction(input: object) {
    try {
      await validateOrReject(input);
    } catch (errors) {
      throw new BadRequestException(
        `One on more fields is not valid. Details: ${errors.toString()}`,
      );
    }
  }
}
