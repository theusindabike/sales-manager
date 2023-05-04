import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  type: TransactionType;

  @ApiPropertyOptional()
  date: Date;

  @ApiPropertyOptional()
  productDescription: string;

  @ApiPropertyOptional()
  value: number;

  @ApiPropertyOptional()
  sellerName: string;
}
