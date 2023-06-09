import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum TransactionType {
  PRODUCER_SALE = 1,
  AFFILIATE_SALE = 2,
  COMMISSION_PAID = 3,
  COMMISSION_RECIEVED = 4,
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.PRODUCER_SALE,
    nullable: false,
  })
  type: TransactionType;

  @Column({
    type: 'timestamptz',
    nullable: false,
  })
  date: Date;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  productDescription: string;

  @Column({
    type: 'float',
    default: 0.0,
    nullable: false,
  })
  value: number;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  sellerName: string;

  public static of(params: Partial<Transaction>): Transaction {
    const transaction = new Transaction();
    return Object.assign(transaction, params);
  }

  constructor(
    id?: number,
    type?: TransactionType,
    date?: Date,
    productDescription?: string,
    value?: number,
    sellerName?: string,
  ) {
    this.id = id || null;
    this.type = type || null;
    this.date = date || null;
    this.productDescription = productDescription || '';
    this.value = value || null;
    this.sellerName = sellerName || '';
  }
}
