import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionFileDto } from './dto/transaction-file.dto';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { ImportTransactionsService } from './services/import-transactions.service';

const FILE_SIZE = 10;
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly importTransactionsService: ImportTransactionsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  // @Get()
  // async findAll() {
  //   return await this.transactionsService.findAll();
  // }
  @ApiQuery({
    name: 'sellerName',
    type: String,
    description: 'Seller Name. Optional',
    required: false,
  })
  @Get()
  async findBySellerName(@Query('sellerName') sellerName?: string) {
    return sellerName != null
      ? await this.transactionsService.findBySellerName(sellerName)
      : await this.transactionsService.findAll();
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Transaction Text File',
    type: TransactionFileDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  uploadTransactionFile(
    @Res() response: Response,
    @Body() body: TransactionFileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'text',
        })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * FILE_SIZE })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    const transactions =
      this.importTransactionsService.importTransactions(file);
    response.status(HttpStatus.CREATED).json({ ...transactions });
  }

  @Get('balance')
  async getBalance(
    @Res() response: Response,
    @Query('sellerName') sellerName: string,
  ) {
    const balance = await this.transactionsService.getBalance(sellerName);
    response.status(HttpStatus.OK).json({ ...balance });
  }
}
