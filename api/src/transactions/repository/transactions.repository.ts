import { DataSource, Repository } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { TransactionValuesDto } from '../dto/balance.dto';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getSellerSalesCommissionDiscountedByName(
    sellerName: string,
  ): Promise<TransactionValuesDto> {
    const rawResult = await this.dataSource.query(
      ' \
            SELECT \
              SUM( \
                  CASE \
                      WHEN t."type" = $1 THEN value \
                      WHEN t."type" = $2 THEN -value \
                      ELSE 0 \
                  END \
              ) AS value \
            FROM \
              transaction t\
            WHERE \
              t."sellerName" = $3 \
        ',
      [
        TransactionType.PRODUCER_SALE,
        TransactionType.COMMISSION_PAID,
        sellerName,
      ],
    );
    return TransactionValuesDto.of({
      name: sellerName,
      value: rawResult[0].value,
    });
  }

  async getAffiliateCommissionByName(
    affiliateName: string,
  ): Promise<TransactionValuesDto> {
    const rawResult = await this.dataSource.query(
      ' \
            SELECT \
              COALESCE(SUM(t."value"), 0) AS value \
            FROM \
              transaction t\
            WHERE \
              t."sellerName" = $1 \
              AND t."type" = $2 \
        ',
      [affiliateName, TransactionType.COMMISSION_RECIEVED],
    );
    return TransactionValuesDto.of({
      name: affiliateName,
      value: rawResult[0].value,
    });
  }

  async getAffiliateSalesToSellerRecieveBySellerName(
    sellerName: string,
  ): Promise<TransactionValuesDto> {
    const rawResult = await this.dataSource.query(
      ' \
            SELECT \
              COALESCE(SUM(t."value"), 0) as value \
            FROM \
              transaction t \
            WHERE \
              t."date" IN ( \
                SELECT \
                  t."date" \
                FROM \
                  transaction t \
                WHERE \
                  t."sellerName" = $1 \
                  AND t."type" = $2 \
              ) \
              AND \
                t."type" = $3\
        ',
      [
        sellerName,
        TransactionType.COMMISSION_PAID,
        TransactionType.AFFILIATE_SALE,
      ],
    );
    return TransactionValuesDto.of({
      name: sellerName,
      value: rawResult[0].value,
    });
  }
}
