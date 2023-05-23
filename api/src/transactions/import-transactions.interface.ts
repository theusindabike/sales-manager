import { Transaction } from './entities/transaction.entity';

export interface ImportTransactionsServiceInterface {
  importTransactions(file: Express.Multer.File): Promise<Transaction[]>;
}
