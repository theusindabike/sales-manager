import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiPropertyOptional()
  id: number;

  @ApiPropertyOptional()
  type: string;

  @ApiPropertyOptional()
  date: Date;

  @ApiPropertyOptional()
  productDescription: string;

  @ApiPropertyOptional()
  value: number;

  @ApiPropertyOptional()
  sellerName: string;

  @ApiPropertyOptional()
  createdAt: Date;
}
