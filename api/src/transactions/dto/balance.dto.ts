import { ApiProperty } from '@nestjs/swagger';

export class BalanceDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  balanceAsSeller: number;

  @ApiProperty()
  balanceAsAffiliate: number;

  public static of(params: Partial<BalanceDto>): BalanceDto {
    const balanceDto = new BalanceDto();
    return Object.assign(balanceDto, params);
  }
}

export class TransactionValuesDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;

  public static of(
    params: Partial<TransactionValuesDto>,
  ): TransactionValuesDto {
    const getTransactionValuesDto = new TransactionValuesDto();
    return Object.assign(getTransactionValuesDto, params);
  }
}
