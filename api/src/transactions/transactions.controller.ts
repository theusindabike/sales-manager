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
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ImportTransactionsService } from './services/import-transactions.service';
import { Transaction } from './entities/transaction.entity';
import { BalanceDto } from './dto/balance.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

const fileSize = 10;
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly importTransactionsService: ImportTransactionsService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @ApiQuery({
    name: 'sellerName',
    type: String,
    description: 'Seller Name. Optional',
    required: false,
  })
  @ApiOkResponse({
    description: 'Transactions list',
    type: CreateTransactionDto,
    isArray: true,
  })
  @Get()
  findBySellerName(
    @Query('sellerName') sellerName?: string,
  ): Promise<Transaction[]> {
    return sellerName != null
      ? this.transactionsService.findBySellerName(sellerName)
      : this.transactionsService.findAll();
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Transaction Text File',
    type: TransactionFileDto,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Upload a text file with sales data',
    type: CreateTransactionDto,
    isArray: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadTransactionFile(
    @Res() response: Response,
    @Body() body: TransactionFileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'text',
        })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * fileSize })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    const transactions =
      await this.importTransactionsService.importTransactions(file);
    response.status(HttpStatus.CREATED).json({ ...transactions });
  }

  @ApiOkResponse({
    description: 'Get balance by Seller or Affiliate name',
    type: BalanceDto,
  })
  @Get('balance')
  getBalanceByName(
    @Query('sellerName') sellerName: string,
  ): Promise<BalanceDto> {
    return this.transactionsService.getBalanceByName(sellerName);
  }
}
