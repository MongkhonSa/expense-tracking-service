import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { TRANSACTION_ENUM } from 'src/const';
import { CreateTransactionRecordDto } from './dto/create-transaction-record.dto';
import { GetReportDto } from './dto/get-report-dto';
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
  @Post('report')
  async getReport(
    @Param('type') type: TRANSACTION_ENUM,
    @Body() getReportDto: GetReportDto,
    @Res() response: Response,
  ) {
    const report =
      await this.incomeAndExpensesAccountService.findTransactionByType(
        getReportDto.type,
        getReportDto.startDate,
        getReportDto.endDate,
      );
    return response.status(HttpStatus.OK).send(report);
  }
}
