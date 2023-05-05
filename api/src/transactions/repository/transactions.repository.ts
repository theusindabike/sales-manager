import { DataSource, Repository } from 'typeorm';
import { Transaction, TransactionType } from '../entities/transaction.entity';

export class TransactionRepository extends Repository<Transaction> {
  constructor(private dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }

  async getSellerBalance(sellerName: string) {
    const rawData = await this.query(
      ' \
            SELECT \
                SUM( \
                    CASE \
                        WHEN type = :PRODUCER_SALE THEN value \
                        WHEN type = :COMMISSION_PAID THEN -value \
                        ELSE 0 \
                    END \
                ) AS balance \
            FROM \
                transactions \
            WHERE \
                sellerName = :sellerName \
        ',
      [
        {
          sellerName: sellerName,
          PRODUCER_SALE: TransactionType.PRODUCER_SALE,
          COMMISSION_PAID: TransactionType.COMMISSION_PAID,
        },
      ],
    );
    // let sum = this.dataSource
    //   .createQueryBuilder()
    //   .select('SUM(t.value)', "sum")
    //   .from(Transaction, 't')
    //   .where(
    //     't.sellerName = :sellerName \
    //     AND t.type IN (:sellerTranasctionsType)',
    //     { sellerName: sellerName, sellerTranasctionsType: [TransactionType.] },
    //   );
    return rawData;
  }
}
