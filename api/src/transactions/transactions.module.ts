import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { transactionProviders } from './transactions.providers';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [TransactionsController],
  providers: [
    // ...transactionProviders,
    TransactionsService,
    ],
  // exports: [TransactionsService],
})
export class TransactionsModule {}
