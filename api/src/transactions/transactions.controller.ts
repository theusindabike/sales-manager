import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  HttpStatus,
  Res,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionFileDto } from './dto/transaction-file.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
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
        .addMaxSizeValidator({ maxSize: 1024 * 1024 * 10 })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    const transactions = this.transactionsService.ingestSalesFile(file);
    response.status(HttpStatus.CREATED).json({ ...transactions });
  }

  @Get('/balance')
  async getBalance(
    @Res() response: Response,
    @Query('sellerName') sellerName: string,
  ) {
    const balance = await this.transactionsService.getBalance(sellerName);
    response.status(HttpStatus.OK).json({ ...balance });
  }
}
