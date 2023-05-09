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

export class GetBalanceDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  balance: number;

  public static of(params: Partial<GetBalanceDto>): GetBalanceDto {
    const getBalanceDto = new GetBalanceDto();
    return Object.assign(getBalanceDto, params);
  }
}
