import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TRANSACTION_ENUM } from '../const';
import { DataSource } from 'typeorm';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { IncomeAndExpensesAccount } from './entities/income-and-expenses-account.entity';
import { Transaction } from './entities/transaction.entity';
import { IncomeAndExpensesAccountController } from './income-and-expenses-account.controller';
import { IncomeAndExpensesAccountService } from './income-and-expenses-account.service';
import { GetReportDto } from './dto/get-report-dto';

describe('IncomeAndExpensesAccountController', () => {
  let incomeAndExpensesAccountController: IncomeAndExpensesAccountController;
  let incomeAndExpensesAccountService: IncomeAndExpensesAccountService;
  const mockUserId = 'mock-user-id';
  const mockIncomeAndExpensesAccount: IncomeAndExpensesAccount = {
    totalIncome: 100,
    totalExpenses: 100,
    id: 'mock-id',
    user: {
      id: mockUserId,
      username: 'mock-user',
      password: 'mock-password',
      isValidated: true,
    },
    transaction: [],
  };
  const mockIncomeTransaction: Transaction = {
    image: 'image-path',
    incomeAndExpensesAccount: mockIncomeAndExpensesAccount,
    categoryName: 'mock-category-name',
    id: 'mock-transaction-id',
    amount: 1000,
    type: TRANSACTION_ENUM.INCOME,
    createdAt: new Date('12/12/2000'),
  };
  const mockExpensesTransaction: Transaction = {
    ...mockIncomeTransaction,
    type: TRANSACTION_ENUM.EXPENSES,
  };
  const mockCreateTransactionRecordDto: CreateTransactionRecordDto = {
    categoryName: 'mock-category-name',
    amount: 1000,
  };
  const mockDataSource = () => ({
    transaction: jest.fn(),
  });

  const INCOME_AND_EXPENSES_ACCOUNT_REPOSITORY_TOKEN = getRepositoryToken(
    IncomeAndExpensesAccount,
  );
  const TRANSACTION_REPOSITORY_TOKEN = getRepositoryToken(Transaction);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IncomeAndExpensesAccountController],
      providers: [
        IncomeAndExpensesAccountService,
        { provide: DataSource, useFactory: mockDataSource },
        {
          provide: INCOME_AND_EXPENSES_ACCOUNT_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: TRANSACTION_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    incomeAndExpensesAccountController =
      module.get<IncomeAndExpensesAccountController>(
        IncomeAndExpensesAccountController,
      );
    incomeAndExpensesAccountService =
      module.get<IncomeAndExpensesAccountService>(
        IncomeAndExpensesAccountService,
      );
  });

  it('should be defined', () => {
    expect(incomeAndExpensesAccountController).toBeDefined();
  });
  describe('findOneByUserId', () => {
    it('should return income and expenses account', async () => {
      jest
        .spyOn(incomeAndExpensesAccountService, 'findOneByUserId')
        .mockResolvedValue(mockIncomeAndExpensesAccount);
      expect(await incomeAndExpensesAccountController.findOne(mockUserId)).toBe(
        mockIncomeAndExpensesAccount,
      );
    });
  });
  describe('createIncomeRecord', () => {
    it('should create transaction record', async () => {
      jest
        .spyOn(incomeAndExpensesAccountService, 'createIncomeRecord')
        .mockResolvedValue(mockIncomeTransaction);
      expect(
        await incomeAndExpensesAccountController.createIncomeRecord(
          mockUserId,
          mockCreateTransactionRecordDto,
        ),
      ).toBe(mockIncomeTransaction);
    });
  });
  describe('createExpensesRecord', () => {
    it('should create transaction record', async () => {
      jest
        .spyOn(incomeAndExpensesAccountService, 'createExpensesRecord')
        .mockResolvedValue(mockExpensesTransaction);
      expect(
        await incomeAndExpensesAccountController.createExpensesRecord(
          mockUserId,
          mockCreateTransactionRecordDto,
        ),
      ).toBe(mockExpensesTransaction);
    });
  });
  describe('getReport', () => {
    const mockResponse: any = {
      send: () => 'mockReport',
      status: () => mockResponse,
    };
    const mockGetRportInput: GetReportDto = {
      type: TRANSACTION_ENUM.EXPENSES,
      startDate: new Date('12/12/2022'),
      endDate: new Date('12/12/2022'),
    };
    it('should return report correctly', async () => {
      jest
        .spyOn(incomeAndExpensesAccountService, 'findTransactionByType')
        .mockResolvedValue([]);
      expect(
        await incomeAndExpensesAccountController.getReport(
          mockGetRportInput,
          mockResponse,
        ),
      ).toBe('mockReport');
    });
  });
  describe('uploadFile', () => {
    it('should upload file correcty', async () => {
      const mockFile = {
        originalname: 'sample.name',
        mimetype: 'sample.type',
        path: 'sample.url',
        buffer: Buffer.from('whatever'),
      } as Express.Multer.File;
      expect(incomeAndExpensesAccountController.uploadFile(mockFile)).toBe(
        mockFile,
      );
    });
  });
});
