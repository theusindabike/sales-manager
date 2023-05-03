import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  constructor(
    id?: number,
    type?: TransactionType,
    date?: Date,
    productDescription?: string,
    value?: number,
    sellerName?: string,
    createdAt?: Date,
  ) {
    this.id = id || null;
    this.type = type || null;
    this.date = date || null;
    this.productDescription = productDescription || '';
    this.value = value || null;
    this.sellerName = sellerName || '';
    this.createdAt = createdAt || null;
  }

  // constructor(t: Partial<Transaction>) {
  //   this.id = t.id || null;
  //   this.type = t.type || null;
  //   this.date = t.date || null;
  //   this.productDescription = t.productDescription || '';
  //   this.value = t.value || null;
  //   this.sellerName = t.sellerName || '';
  //   this.createdAt = t.createdAt || null;
  // }
}
