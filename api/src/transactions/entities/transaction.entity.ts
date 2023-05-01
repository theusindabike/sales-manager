import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  type: string;

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
