import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TRANSACTION_ENUM } from '../const';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { IncomeAndExpensesAccount } from './entities/income-and-expenses-account.entity';
import { Transaction } from './entities/transaction.entity';
import { IncomeAndExpensesAccountService } from './income-and-expenses-account.service';

describe('IncomeAndExpensesAccountService', () => {
  const mockUserId = 'mockUserId';
  const mockIncomeAndExpensesAccount = {
    id: 'mock-id',
    totalExpenses: 100,
    totalIncome: 100,
  };
  const mockCreateTransactionRecordDto: CreateTransactionRecordDto = {
    categoryName: 'mock-category-name',
    amount: 100,
  };
  let incomeAndExpensesAccountService: IncomeAndExpensesAccountService;
  let transactionRepository: Repository<Transaction>;
  let incomeAndExpensesAccountRepository: Repository<IncomeAndExpensesAccount>;

  const INCOME_AND_EXPENSES_ACCOUNT_REPOSITORY_TOKEN = getRepositoryToken(
    IncomeAndExpensesAccount,
  );
  const TRANSACTION_REPOSITORY_TOKEN = getRepositoryToken(Transaction);

  let dataSource;
  const mockDataSource = () => ({
    transaction: jest.fn(),
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomeAndExpensesAccountService,
        { provide: DataSource, useFactory: mockDataSource },
        {
          provide: INCOME_AND_EXPENSES_ACCOUNT_REPOSITORY_TOKEN,
          useValue: {
            findOneBy: jest
              .fn()
              .mockResolvedValue(mockIncomeAndExpensesAccount),
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

    incomeAndExpensesAccountService =
      module.get<IncomeAndExpensesAccountService>(
        IncomeAndExpensesAccountService,
      );
    incomeAndExpensesAccountRepository = module.get<
      Repository<IncomeAndExpensesAccount>
    >(INCOME_AND_EXPENSES_ACCOUNT_REPOSITORY_TOKEN);
    transactionRepository = module.get<Repository<Transaction>>(
      TRANSACTION_REPOSITORY_TOKEN,
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(incomeAndExpensesAccountService).toBeDefined();
    expect(incomeAndExpensesAccountRepository).toBeDefined();
    expect(transactionRepository).toBeDefined();
    expect(dataSource).toBeDefined();
  });
  describe('findOneByUserId', () => {
    it('should find one by id correctly', () => {
      incomeAndExpensesAccountService.findOneByUserId(mockUserId);
      expect(incomeAndExpensesAccountRepository.findOneBy).toHaveBeenCalledWith(
        { user: { id: mockUserId } },
      );
    });
  });
  describe('createIncomeRecord', () => {
    it('should call transaction save correctly', async () => {
      const mockedManager = {
        save: jest.fn(),
      };
      dataSource.transaction.mockImplementation((cb) => {
        cb(mockedManager);
      });
      await incomeAndExpensesAccountService.createIncomeRecord(
        mockUserId,
        mockCreateTransactionRecordDto,
      );
      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockedManager.save).toHaveBeenCalledTimes(2);
      expect(incomeAndExpensesAccountRepository.findOneBy).toHaveBeenCalledWith(
        {
          user: {
            id: mockUserId,
          },
        },
      );
      expect(transactionRepository.create).toHaveBeenCalledWith({
        ...mockCreateTransactionRecordDto,
        incomeAndExpensesAccount: mockIncomeAndExpensesAccount,
        type: TRANSACTION_ENUM.INCOME,
      });
    });
  });
  describe('createExpensesRecord', () => {
    it('should call transaction save correctly', async () => {
      const mockedManager = {
        save: jest.fn(),
      };
      dataSource.transaction.mockImplementation((cb) => {
        cb(mockedManager);
      });
      await incomeAndExpensesAccountService.createExpensesRecord(
        mockUserId,
        mockCreateTransactionRecordDto,
      );
      expect(dataSource.transaction).toHaveBeenCalled();
      expect(mockedManager.save).toHaveBeenCalledTimes(2);
      expect(incomeAndExpensesAccountRepository.findOneBy).toHaveBeenCalledWith(
        {
          user: {
            id: mockUserId,
          },
        },
      );
      expect(transactionRepository.create).toHaveBeenCalledWith({
        ...mockCreateTransactionRecordDto,
        incomeAndExpensesAccount: mockIncomeAndExpensesAccount,
        type: TRANSACTION_ENUM.EXPENSES,
      });
    });
  });
});
