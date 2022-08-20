import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IncomeAndExpensesAccount } from '../income-and-expenses-account/entities/income-and-expenses-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, IncomeAndExpensesAccount])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
