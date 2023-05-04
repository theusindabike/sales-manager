// export class TransactionFileDto {
//   name: string;
// }

import { ApiProperty } from '@nestjs/swagger';

export class TransactionFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
