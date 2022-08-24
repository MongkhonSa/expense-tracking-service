import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTION_ENUM } from '../const';
import * as dayjs from 'dayjs';
import { DataSource, Repository } from 'typeorm';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { IncomeAndExpensesAccount } from './entities/income-and-expenses-account.entity';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class IncomeAndExpensesAccountService {
  constructor(
    private dataSource: DataSource,

    @InjectRepository(IncomeAndExpensesAccount)
    private incomeAndExpensesAccountRepository: Repository<IncomeAndExpensesAccount>,

    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}
  findOneByUserId(userId: string) {
    return this.incomeAndExpensesAccountRepository.findOneBy({
      user: { id: userId },
    });
  }
  async createIncomeRecord(
    userId: string,
    createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    const incomeAndExpensesAccount =
      await this.incomeAndExpensesAccountRepository.findOneBy({
        user: { id: userId },
      });
    const incomeTransaction = this.transactionRepository.create({
      ...createTransactionRecordDto,
      type: TRANSACTION_ENUM.INCOME,
      incomeAndExpensesAccount,
    });
    incomeAndExpensesAccount.totalIncome =
      incomeAndExpensesAccount.totalIncome + createTransactionRecordDto.amount;
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(incomeTransaction);
      await transactionalEntityManager.save(incomeAndExpensesAccount);
    });
    return incomeTransaction;
  }
  async createExpensesRecord(
    userId: string,
    createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    const incomeAndExpensesAccount =
      await this.incomeAndExpensesAccountRepository.findOneBy({
        user: { id: userId },
      });
    const expensesTransaction = this.transactionRepository.create({
      ...createTransactionRecordDto,
      type: TRANSACTION_ENUM.EXPENSES,
      incomeAndExpensesAccount,
    });
    incomeAndExpensesAccount.totalExpenses =
      incomeAndExpensesAccount.totalExpenses +
      createTransactionRecordDto.amount;
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(expensesTransaction);
      await transactionalEntityManager.save(incomeAndExpensesAccount);
    });
    return expensesTransaction;
  }
  findTransactionByType(
    type: TRANSACTION_ENUM,
    startDate: Date,
    endDate: Date,
  ) {
    const startDateFormatted = dayjs(startDate);
    const endDateFormatted = dayjs(endDate);

    return this.transactionRepository
      .createQueryBuilder('transaction')
      .select('transaction.category_name', 'categoryName')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('transaction.createdAt >= :startDate', {
        startDate: startDateFormatted,
      })
      .andWhere('transaction.createdAt < :endDate', {
        endDate: endDateFormatted,
      })
      .andWhere('transaction.type =:type', { type })
      .groupBy('transaction.category_name')
      .getRawMany<{ categoryName: string }[]>();
  }
}
