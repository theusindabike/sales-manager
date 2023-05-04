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
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TransactionFileDto } from './dto/transaction-file.dto';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionsService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(+id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Transaction Text File',
    type: TransactionFileDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  uploadTransactionFile(
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
    this.transactionsService.ingestSalesFile(file);
    return { status: HttpStatus.CREATED, content: 'vai dar tudo certo' };
    // return {
    //   body,
    //   file: file.buffer.toString(),
    // };
  }
}
