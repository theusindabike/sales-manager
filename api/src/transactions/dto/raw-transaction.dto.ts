import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class RawTransactionDto {
  @IsEnum(TransactionType)
  @ApiProperty()
  type: TransactionType;

  @IsDate()
  @ApiProperty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(30)
  @ApiProperty()
  productDescription: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  @ApiProperty()
  value: number;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  @ApiProperty()
  sellerName: string;

  public static of(params: Partial<RawTransactionDto>): RawTransactionDto {
    const rawTransactionDto = new RawTransactionDto();
    return Object.assign(rawTransactionDto, params);
  }

  public static fromRow(row: any) {
    return RawTransactionDto.of({
      type: parseInt(row['type']),
      date: new Date(row['date']),
      productDescription: row['productDescription'],
      value: +(parseFloat(row['value']) / 100).toFixed(2),
      sellerName: row['sellerName'],
    });
  }
}
