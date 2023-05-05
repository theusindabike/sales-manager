import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';

export class SellerBalanceDto {
  @ApiPropertyOptional()
  sellerName: string;

  @ApiPropertyOptional()
  value: number;
}
