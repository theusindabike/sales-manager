import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TransactionRepository } from './repository/transactions.repository';
import { ImportTransactionsService } from './services/import-transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [TransactionsController],
  exports: [TransactionsService],
  providers: [
    {
      provide: 'ImportTransactionsServiceInterface',
      useClass: ImportTransactionsService,
    },
    ImportTransactionsService,
    TransactionsService,
    TransactionRepository,
  ],
})
export class TransactionsModule {}
