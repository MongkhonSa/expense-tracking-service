import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { IncomeAndExpensesAccountService } from './income-and-expenses-account.service';

@Controller('income-and-expenses-account')
export class IncomeAndExpensesAccountController {
  constructor(
    private readonly incomeAndExpensesAccountService: IncomeAndExpensesAccountService,
  ) {}

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.incomeAndExpensesAccountService.findOneByUserId(userId);
  }
  @Post(':userId/income')
  createIncomeRecord(
    @Param('userId') userId: string,
    @Body() createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    return this.incomeAndExpensesAccountService.createIncomeRecord(
      userId,
      createTransactionRecordDto,
    );
  }
  @Post(':userId/expenses')
  createExpensesRecord(
    @Param('userId') userId: string,
    @Body() createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    return this.incomeAndExpensesAccountService.createExpensesRecord(
      userId,
      createTransactionRecordDto,
    );
  }
}
