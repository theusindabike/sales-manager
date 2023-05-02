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
    type: 'decimal',
    precision: 10,
    default: 0,
    scale: 2,
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
}
