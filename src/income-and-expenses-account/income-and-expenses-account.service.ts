import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TRANSACTION_ENUM } from 'src/const';

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
    return this.transactionRepository.save(incomeTransaction);
  }
  async createExpensesRecord(
    userId: string,
    createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    const incomeAndExpensesAccount =
      await this.incomeAndExpensesAccountRepository.findOneBy({
        user: { id: userId },
      });
    const incomeTransaction = this.transactionRepository.create({
      ...createTransactionRecordDto,
      type: TRANSACTION_ENUM.EXPENSES,
      incomeAndExpensesAccount,
    });
    incomeAndExpensesAccount.totalExpenses =
      incomeAndExpensesAccount.totalExpenses +
      createTransactionRecordDto.amount;
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(incomeTransaction);
      await transactionalEntityManager.save(incomeAndExpensesAccount);
    });
    return this.transactionRepository.save(incomeTransaction);
  }
}
