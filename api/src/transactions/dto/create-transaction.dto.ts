import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty()
  type: TransactionType;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  productDescription: string;

  @ApiProperty()
  value: number;

  @ApiProperty()
  sellerName: string;
}
