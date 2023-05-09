import { DataSource, Repository } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { GetBalanceDto } from '../dto/balance.dto';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getSellerBalanceByName(sellerName: string): Promise<GetBalanceDto> {
    const rawResult = await this.dataSource.query(
      ' \
            SELECT \
              t."sellerName" as name, \
              SUM( \
                  CASE \
                      WHEN t."type" = $1 THEN value \
                      WHEN t."type" = $2 THEN -value \
                      ELSE 0 \
                  END \
              ) AS balance \
            FROM \
              transaction t\
            WHERE \
              t."sellerName" = $3 \
            GROUP BY \
              t."sellerName" \
        ',
      [
        TransactionType.PRODUCER_SALE,
        TransactionType.COMMISSION_PAID,
        sellerName,
      ],
    );
    return rawResult[0];
  }

  async getAffiliateBalanceByName(sellerName: string): Promise<GetBalanceDto> {
    const rawResult = await this.dataSource.query(
      ' \
            SELECT \
              t."sellerName" as name, \
              SUM( \
                  CASE \
                      WHEN t."type" = $1 THEN value \
                      WHEN t."type" = $2 THEN value \
                      ELSE 0 \
                  END \
              ) AS balance \
            FROM \
              transaction t\
            WHERE \
              t."sellerName" = $3 \
            GROUP BY \
              t."sellerName" \
        ',
      [
        TransactionType.AFFILIATE_SALE,
        TransactionType.COMMISSION_RECIEVED,
        sellerName,
      ],
    );
    return rawResult[0];
  }
}
