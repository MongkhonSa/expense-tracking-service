import { Module } from '@nestjs/common';
import { IncomeAndExpensesAccountService } from './income-and-expenses-account.service';
import { IncomeAndExpensesAccountController } from './income-and-expenses-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { IncomeAndExpensesAccount } from './entities/income-and-expenses-account.entity';
import { Transaction } from './entities/transaction.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, IncomeAndExpensesAccount, Transaction]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [IncomeAndExpensesAccountController],
  providers: [IncomeAndExpensesAccountService],
})
export class IncomeAndExpensesAccountModule {}
