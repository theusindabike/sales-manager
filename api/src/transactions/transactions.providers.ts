import { DataSource } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

export const transactionProviders = [
  {
    provide: 'TRANSACTION_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      return dataSource.getRepository(Transaction);
    },
    inject: ['DATA_SOURCE'],
  },
];
