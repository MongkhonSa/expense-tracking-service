import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { IncomeAndExpensesAccountService } from './income-and-expenses-account.service';

@Controller('income-and-expenses-account')
export class IncomeAndExpensesAccountController {
  constructor(
    private readonly incomeAndExpensesAccountService: IncomeAndExpensesAccountService,
  ) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomeAndExpensesAccountService.findOneByUserId(id);
  }
  @Post(':id/income')
  createIncomeRecord(
    @Param('id') id: string,
    @Body() createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    return this.incomeAndExpensesAccountService.createIncomeRecord(
      id,
      createTransactionRecordDto,
    );
  }
  @Post(':id/expenses')
  createExpensesRecord(
    @Param('id') id: string,
    @Body() createTransactionRecordDto: CreateTransactionRecordDto,
  ) {
    return this.incomeAndExpensesAccountService.createExpensesRecord(
      id,
      createTransactionRecordDto,
    );
  }
}
