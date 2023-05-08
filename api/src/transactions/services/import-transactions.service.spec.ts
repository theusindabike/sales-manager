import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from './../repository/transactions.repository';
import { TransactionsService } from '../transactions.service';
import { ImportTransactionsService } from './import-transactions.service';
import mockfs = require('mock-fs');
import fs = require('fs');

describe('TransactionsService', () => {
  let service: ImportTransactionsService;

  beforeEach(async () => {
    const transactionRepositoryMockProvider = {
      provide: TransactionRepository,
      useValue: {
        create: jest.fn().mockReturnValue(true),
        save: jest.fn(),
        insert: jest.fn().mockResolvedValue(true),
      },
    };
    const transactionServiceMockProvider = {
      provide: TransactionsService,
      useValue: {
        create: jest.fn().mockReturnValue(true),
        save: jest.fn(),
        insert: jest.fn().mockResolvedValue(true),
        saveImportedTransactions: jest.fn().mockResolvedValue(true),
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportTransactionsService,
        transactionRepositoryMockProvider,
        transactionServiceMockProvider,
      ],
    }).compile();

    service = module.get(ImportTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ParseRawTransaction', () => {
    beforeEach(async () => {
      return null;
    });
    it('throws error when no file exists', async () => {
      mockfs.restore();
      await expect(
        service.importTransactions({ buffer: null } as Express.Multer.File),
      ).rejects.toThrowError(Error);
    });

    it('throws error if class-validator return error', async () => {
      mockfs({
        'test_dir/assets': {
          'sales_sample.txt': mockfs.file({
            content:
              '2022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS\n12021-12-03T11:46:02-03:00DOMINANDO INVESTIMENTOS       0000050000MARIA CANDIDA',
          }),
        },
      });
      const file = fs.readFileSync('test_dir/assets/sales_sample.txt');

      mockfs.restore();
      expect(
        service.importTransactions({ buffer: file } as Express.Multer.File),
      ).rejects.toThrowError(Error);
    });

    it('import sales file with success', async () => {
      mockfs({
        'test_dir/assets': {
          'sales_sample.txt': mockfs.file({
            content:
              '12022-01-15T19:20:30-03:00CURSO DE BEM-ESTAR            0000012750JOSE CARLOS\n22022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000012750THIAGO OLIVEIRA\n42022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500THIAGO OLIVEIRA\n32022-01-16T14:13:54-03:00CURSO DE BEM-ESTAR            0000004500JOSE CARLOS',
          }),
        },
      });
      const file = fs.readFileSync('test_dir/assets/sales_sample.txt');

      mockfs.restore();
      expect(
        service.importTransactions({ buffer: file } as Express.Multer.File),
      ).resolves;
    });
  });
});
